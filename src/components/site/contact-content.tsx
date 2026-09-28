"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useSiteData } from "@/lib/store";
import type { Message } from "@/lib/types";
import { ContactChannels } from "./contact-channels";
import { PageHeading } from "./page-heading";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "xqapjvyr";

const SERVICE_OPTIONS = [
  { value: "web-audit", label: "Web Security Audit" },
  { value: "network", label: "Network Security" },
  { value: "hardening", label: "Server Hardening" },
  { value: "pentest", label: "Penetration Testing" },
  { value: "it-support", label: "IT Support" },
  { value: "other", label: "Other" },
];

type Status = { text: string; tone: "ok" | "warn" } | null;

export function ContactContent() {
  const { data, update } = useSiteData();
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const entry: Message = {
      id: "msg" + Date.now(),
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
      date: new Date().toISOString(),
      read: false,
    };

    update((d) => {
      d.messages = [entry, ...(d.messages ?? [])];
    });

    setSending(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ text: "✓ Message sent. I'll reply within 24 hours.", tone: "ok" });
    } catch {
      setStatus({ text: "✓ Saved locally (email delivery may be delayed).", tone: "warn" });
    } finally {
      setSending(false);
      form.reset();
    }
  }

  const labelCls = "text-xs uppercase tracking-widest text-primary/50";

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-20">
      <PageHeading eyebrow="// Initiate Contact" title="Client Request">
        Describe your security issue and I&apos;ll get back to you.
      </PageHeading>

      <div className="mb-8">
        <ContactChannels />
      </div>

      <Card className="ring-primary/20">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className={labelCls}>// Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className={labelCls}>// Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="service" className={labelCls}>// Service</Label>
              <NativeSelect id="service" name="service" defaultValue="">
                <option value="">Select a service...</option>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message" className={labelCls}>// Message</Label>
              <Textarea id="message" name="message" rows={5} className="resize-none" placeholder="Describe your security issue or scope..." />
            </div>
            <Button type="submit" size="lg" disabled={sending} className="mt-2 tracking-widest">
              {sending ? "[ SENDING... ]" : "[ SEND REQUEST ]"}
            </Button>
            {status && (
              <p className={`text-center text-xs ${status.tone === "ok" ? "text-primary" : "text-yellow-400"}`}>
                {status.text}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 text-sm text-primary/50">
          <span className="text-lg">🔒</span>
          <span>{data.contact.encrypted}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-primary/50">
          <span className="text-lg">⚡</span>
          <span>{data.contact.responseTime}</span>
        </div>
      </div>
    </main>
  );
}
