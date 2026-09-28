"use client";

import { Mail } from "lucide-react";
import { useSiteData } from "@/lib/store";
import { handleFromUrl } from "@/lib/helpers";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function Channel({
  href,
  label,
  value,
  icon,
  external,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col items-center gap-2 rounded-lg border border-primary/20 bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:glow"
    >
      <div className="text-primary/70 transition-colors group-hover:text-primary">{icon}</div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-primary/40">{label}</div>
      <div className="w-full truncate text-sm text-primary">{value}</div>
    </a>
  );
}

export function ContactChannels() {
  const { data } = useSiteData();
  const c = data.contact;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Channel href={`mailto:${c.email}`} label="Email" value={c.email} icon={<Mail className="size-7" strokeWidth={1.8} />} />
      <Channel href={c.github} external label="GitHub" value={`@${handleFromUrl(c.github)}`} icon={<GithubIcon />} />
      <Channel href={c.linkedin} external label="LinkedIn" value={`/in/${handleFromUrl(c.linkedin)}`} icon={<LinkedinIcon />} />
    </div>
  );
}
