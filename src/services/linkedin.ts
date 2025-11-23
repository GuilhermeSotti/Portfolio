import type { LinkedInPublicProfile, ExperienceItem, ProjectItem } from "../types/linkedin";
import cheerio from "cheerio";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36 PortfolioScraper/1.0";

/**
 * Normalize the input to a LinkedIn public profile URL.
 * Accepts "GuilhermeSotti", "https://linkedin.com/in/xxx", etc.
 */
function normalizeProfileUrl(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // allow username only
  return `https://www.linkedin.com/in/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

/**
 * Attempt to parse application/ld+json script tag if present.
 */
function parseJsonLd($: cheerio.CheerioAPI) {
  const script = $('script[type="application/ld+json"]').first().text();
  if (!script) return null;
  try {
    return JSON.parse(script);
  } catch {
    return null;
  }
}

/**
 * Extract Open Graph tags into an object.
 */
function parseOg($: cheerio.CheerioAPI) {
  const og: Record<string, string | undefined> = {};
  $('meta[property^="og:"], meta[name^="og:"]').each((_, el) => {
    const $el = $(el);
    const key = ($el.attr("property") || $el.attr("name") || "").trim();
    const val = $el.attr("content") || undefined;
    if (key) og[key] = val;
  });
  // also get twitter cards
  $("meta[name^='twitter:']").each((_, el) => {
    const $el = $(el);
    const key = $el.attr("name") || "";
    if (key) og[key] = $el.attr("content") || undefined;
  });
  return og;
}

/**
 * Lightweight heuristic extraction for experiences/projects.
 * NOTE: LinkedIn often renders these client-side. This heuristic
 * tries to find visible sections on server-side HTML; may fail.
 */
function parseExperiences($: cheerio.CheerioAPI): ExperienceItem[] {
  const out: ExperienceItem[] = [];

  // Try to find sections with "Experience" heading and list items
  const experienceHeaders = $('section, div')
    .filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return /\bexperience\b|\bexperiênc/i.test(text) && $(el).find("li, div").length > 0;
    })
    .slice(0, 1);

  if (experienceHeaders.length > 0) {
    const root = experienceHeaders.first();
    // look for list items inside
    $(root)
      .find("li, div")
      .each((_, el) => {
        const $el = $(el);
        const text = $el.text().replace(/\s+/g, " ").trim();
        // heuristic: split by "·" or "—" or newline
        if (text.length < 20) return;
        const parts = text.split(/\s?·\s?|\s?—\s?|\n/).map((p) => p.trim()).filter(Boolean);
        const title = parts[0] ?? text;
        const company = parts[1] ?? undefined;
        out.push({
          title,
          company,
          description: text
        });
      });
  }

  // fallback empty
  return out;
}

function parseProjects($: cheerio.CheerioAPI): ProjectItem[] {
  const out: ProjectItem[] = [];
  // Try to find "Projects" section
  const sections = $('section, div').filter((_, el) => {
    const text = $(el).text().toLowerCase();
    return /\bprojects\b|\bprojetos\b/.test(text) && $(el).find("li, div, a").length > 0;
  }).slice(0,1);

  if (sections.length > 0) {
    const root = sections.first();
    $(root).find("a, li, div").each((_, el) => {
      const $el = $(el);
      const text = $el.text().replace(/\s+/g, " ").trim();
      if (text.length < 10) return;
      const link = $el.attr("href");
      out.push({ name: text.split(/\n/)[0], description: text, url: link });
    });
  }
  return out;
}

/**
 * Public function: fetch public LinkedIn profile and parse available structured data.
 * Server-side only. Returns a best-effort profile object.
 */
export async function fetchPublicLinkedInProfile(rawInput?: string | null): Promise<LinkedInPublicProfile> {
  const url = normalizeProfileUrl(rawInput ?? process.env.PUBLIC_LINKEDIN_URL ?? null);
  if (!url) {
    return {
      sourceUrl: "",
      fullName: null,
      headline: null,
      location: null,
      avatarUrl: null,
      summary: null,
      experiences: [],
      projects: [],
      raw: {}
    };
  }

  // fetch HTML with a browser-like UA and modest timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s
  let html = "";
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        sourceUrl: url,
        fullName: null,
        headline: null,
        location: null,
        avatarUrl: null,
        summary: null,
        experiences: [],
        projects: [],
        raw: { errorStatus: res.status, bodySnippet: text.substring(0, 400) }
      };
    }
    html = await res.text();
  } catch (err: any) {
    clearTimeout(timeout);
    return {
      sourceUrl: url,
      fullName: null,
      headline: null,
      location: null,
      avatarUrl: null,
      summary: null,
      experiences: [],
      projects: [],
      raw: { error: String(err) }
    };
  }

  const $ = cheerio.load(html);

  // 1) try JSON-LD
  const jsonLd = parseJsonLd($);

  let fullName: string | null = null;
  let headline: string | null = null;
  let avatarUrl: string | null = null;
  let summary: string | null = null;
  let location: string | null = null;

  if (jsonLd) {
    // common schema.org fields: name, jobTitle, image, description
    if (typeof jsonLd.name === "string") fullName = jsonLd.name;
    if (typeof jsonLd.jobTitle === "string") headline = jsonLd.jobTitle;
    if (typeof jsonLd.image === "string") avatarUrl = jsonLd.image;
    if (typeof jsonLd.description === "string") summary = jsonLd.description;
    if (jsonLd.address && typeof jsonLd.address === "object") {
      location = (jsonLd.address.addressLocality || jsonLd.address.addressRegion || null) as string | null;
    }
  }

  // 2) OG tags (robust)
  const og = parseOg($);
  if (!fullName) {
    const ogTitle = og["og:title"] || og["twitter:title"];
    if (ogTitle) {
      // og:title often is "Full Name | Headline" or similar
      const parts = ogTitle.split("|").map((p)=>p.trim());
      fullName = parts[0] ?? fullName;
      if (!headline && parts[1]) headline = parts.slice(1).join(" | ");
    }
  }
  if (!summary) summary = og["og:description"] || og["description"] || null;
  if (!avatarUrl) avatarUrl = og["og:image"] || og["twitter:image"] || null;

  // 3) heuristics: parse visible blocks for location/headline if missing
  if (!headline) {
    // try selectors used in LinkedIn public HTML
    const selHeadline =
      '[data-field="headline"], .text-body-medium, .pv-top-card--list .text-body-medium, .top-card-layout__headline';
    const h = $(selHeadline).first().text().trim();
    if (h) headline = h;
  }
  if (!location) {
    const selLoc = '.top-card__subline-item, .pv-top-card--list-bullet .text-body-small';
    const l = $(selLoc).first().text().trim();
    if (l) location = l;
  }

  // 4) try to parse experiences/projects (best-effort; often client-rendered => may be empty)
  const experiences = parseExperiences($);
  const projects = parseProjects($);

  const profile: LinkedInPublicProfile = {
    sourceUrl: url,
    fullName,
    headline,
    location,
    avatarUrl,
    summary,
    experiences,
    projects,
    raw: { jsonLd: jsonLd ?? null, og }
  };

  return profile;
}
