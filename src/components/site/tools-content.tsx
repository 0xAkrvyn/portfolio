"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading } from "./page-heading";
import { TerminalWindow } from "./terminal-window";

type ToolId = "header" | "port" | "subdomain";
type Line = { text: string; tone?: "ok" | "warn" | "plain" };

const TOOLS: { id: ToolId; icon: string; title: string; desc: string }[] = [
  { id: "header", icon: "🧪", title: "Header Analyzer", desc: "Inspect HTTP security headers for missing or misconfigured directives like CSP, HSTS, and X-Frame-Options." },
  { id: "port", icon: "🔌", title: "Port Scanner", desc: "Enumerate open ports on a target host to identify exposed services and potential entry points." },
  { id: "subdomain", icon: "🗺️", title: "Subdomain Finder", desc: "Discover subdomains of a target domain to map the attack surface and uncover forgotten assets." },
];

const OUTPUT: Record<ToolId, Line[]> = {
  header: [
    { text: "$ curl -I https://target.com", tone: "plain" },
    { text: "Analyzing headers...", tone: "plain" },
    { text: "[!] Missing Content-Security-Policy", tone: "warn" },
    { text: "[!] X-Frame-Options not set", tone: "warn" },
    { text: "[✓] HSTS enabled", tone: "ok" },
  ],
  port: [
    { text: "$ nmap -sS target.com", tone: "plain" },
    { text: "Scanning ports...", tone: "plain" },
    { text: "22/tcp   open  ssh", tone: "ok" },
    { text: "80/tcp   open  http", tone: "ok" },
    { text: "443/tcp  open  https", tone: "ok" },
    { text: "3306/tcp open  mysql (exposed!)", tone: "warn" },
  ],
  subdomain: [
    { text: "$ subfinder -d target.com", tone: "plain" },
    { text: "Enumerating...", tone: "plain" },
    { text: "dev.target.com", tone: "ok" },
    { text: "api.target.com", tone: "ok" },
    { text: "staging.target.com", tone: "ok" },
    { text: "[!] 3 subdomains found", tone: "warn" },
  ],
};

export function ToolsContent() {
  const [active, setActive] = useState<ToolId | null>(null);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-20">
      <PageHeading eyebrow="// Recon & Analysis" title="Security Tools" className="mb-12">
        Demo tools — simulated output for educational purposes.
      </PageHeading>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TOOLS.map((t) => (
          <Card key={t.id} id={t.id} className="ring-primary/20">
            <CardContent className="flex h-full flex-col gap-2 p-6">
              <div className="text-2xl">{t.icon}</div>
              <h2 className="text-base font-bold text-primary">{t.title}</h2>
              <p className="flex-1 text-xs leading-6 text-primary/50">{t.desc}</p>
              <Button size="sm" className="mt-4 w-full tracking-widest" onClick={() => setActive(t.id)}>
                [ RUN ]
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {active && (
        <TerminalWindow title="tool@akrvyensec:~">
          {OUTPUT[active].map((l, i) => (
            <div key={i} className={l.tone === "warn" ? "text-yellow-400" : "text-primary"}>
              {l.text}
            </div>
          ))}
        </TerminalWindow>
      )}
    </main>
  );
}
