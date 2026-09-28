"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/store";
import { TerminalWindow } from "./terminal-window";

export function Hero() {
  const { data, hydrated } = useSiteData();
  const [shown, setShown] = useState(0);

  const lines = [
    `Initializing ${data.site.name} framework...`,
    "Loading service modules...",
    "Cybersecurity · IT Support · Networking",
    "Firewall status: ACTIVE",
    "Systems online. Ready to help.",
  ];

  useEffect(() => {
    if (!hydrated) return;
    setShown(0);
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= lines.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.4em] text-primary/50">{data.site.tagline}</p>
      <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-primary md:text-6xl">
        {data.site.heroTitle1}
        <br />
        <span className="text-white">{data.site.heroTitle2}</span>
      </h1>
      <p className="mb-12 max-w-md text-sm text-primary/60">{data.site.heroSub}</p>

      <TerminalWindow title={`root@${data.site.name.toLowerCase()}:~`} className="max-w-2xl" bodyClassName="h-48">
        <div className="cursor-blink">
          {lines.slice(0, shown).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}
