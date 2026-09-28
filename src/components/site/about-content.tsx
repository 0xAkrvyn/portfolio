"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteData } from "@/lib/store";
import { ContactChannels } from "./contact-channels";
import { PageHeading } from "./page-heading";

export function AboutContent() {
  const { data } = useSiteData();
  const a = data.about;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-20">
      <PageHeading eyebrow="// whoami" title="About Me" className="mb-12" />

      <Card className="mb-10 ring-primary/20">
        <CardContent className="flex flex-col items-start gap-8 p-6 md:flex-row">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-secondary text-2xl text-primary">
            {a.initials}
          </div>
          <div className="flex-1">
            <h2 className="mb-1 text-2xl text-white">{a.name}</h2>
            <p className="mb-4 text-sm tracking-widest text-primary">{a.role}</p>
            <p className="text-sm leading-7 text-primary/70">{a.bio}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {a.stats.map((s, i) => (
          <Card key={i} className="gap-1 bg-secondary px-6 ring-primary/20">
            <div className="text-xs text-primary/60">{s.title}</div>
            <div className="text-lg font-bold text-primary">{s.value}</div>
            <div className="text-xs text-primary/50">{s.desc}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-10 px-6 ring-primary/20">
        <p className="text-xs uppercase tracking-widest text-primary/40">// Skills &amp; Tools</p>
        <div className="flex flex-wrap gap-2">
          {a.skills.map((s) => (
            <Badge key={s} variant="outline" className="border-primary/50 text-primary">
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="px-6 ring-primary/20">
        <p className="text-xs uppercase tracking-widest text-primary/40">// Connect</p>
        <ContactChannels />
      </Card>
    </main>
  );
}
