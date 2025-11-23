import React from "react";
import { LinkedInMergedProfile } from "../types/linkedin";

export default function ProfileCard({ profile }: { profile: LinkedInMergedProfile }) {
  return (
    <section className="card mb-6">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.fullName} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 bg-gray-800 rounded-full" />
        )}

        <div>
          <h2 className="text-2xl font-bold">{profile.fullName}</h2>
          {profile.headline && <p className="text-sm text-gray-400">{profile.headline}</p>}
          {profile.email && <p className="text-sm text-gray-500 mt-1">{profile.email}</p>}
        </div>
      </div>

      {profile.summary && <p className="mt-4 text-sm text-gray-300">{profile.summary}</p>}
    </section>
  );
}
