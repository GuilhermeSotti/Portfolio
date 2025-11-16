import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectCard from "../../src/components/ProjectCard";

const repo = {
  id: "1",
  name: "portfolio-site",
  description: "Meu portfólio",
  url: "https://github.com/GuilhermeSotti/portfolio-site",
  stars: 12,
  forks: 2,
  language: "TypeScript",
  updatedAt: "2024-01-01"
};

describe("ProjectCard", () => {
  it("renderiza nome e link", () => {
    render(<ProjectCard repo={repo as any} />);
    expect(screen.getByText(/portfolio-site/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver no GitHub/i)).toBeInTheDocument();
  });
});
