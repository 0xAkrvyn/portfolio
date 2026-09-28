"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { clone } from "@/lib/helpers";
import { useSiteData } from "@/lib/store";
import type { SiteData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConfirmProvider } from "./confirm-dialog";
import { Field } from "./ui";
import {
  AboutSection,
  BlogSection,
  CategoriesSection,
  ContactSection,
  DashboardSection,
  GeneralSection,
  ServicesSection,
  SettingsSection,
  type SectionProps,
} from "./sections";

export type TabId = "dashboard" | "general" | "about" | "categories" | "services" | "blog" | "contact" | "settings";

function LoginGate() {
  const { login } = useSiteData();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm ring-primary/20 shadow-[0_0_60px_-15px_rgba(0,255,156,0.3)]">
        <CardContent className="p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(!login(user.trim(), pass));
            }}
          >
            <div className="text-center">
              <div className="mb-2 text-4xl">🔐</div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40">// Secure Area</p>
              <h1 className="mt-1 text-2xl font-bold text-primary">&gt;_ ADMIN LOGIN</h1>
            </div>
            <Field label="// Username">
              <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoComplete="username" autoFocus />
            </Field>
            <Field label="// Password">
              <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </Field>
            <Button type="submit" size="lg" className="mt-2 tracking-widest">[ UNLOCK ]</Button>
            {error && <p className="text-center text-xs text-red-400">Invalid credentials.</p>}
            <p className="border-t border-primary/10 pt-3 text-center text-[10px] leading-5 text-primary/30">
              Default: <code className="text-primary">admin</code> / <code className="text-primary">akrvyensec2026</code>
              <br />
              Change in Settings after login.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard() {
  const { data, save, logout } = useSiteData();
  const [working, setWorking] = useState<SiteData>(() => clone(data));
  const [tab, setTab] = useState<TabId>("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  /** Mutate the working copy (unsaved until SAVE ALL). */
  const mutate = (fn: (d: SiteData) => void) =>
    setWorking((prev) => {
      const next = clone(prev);
      fn(next);
      return next;
    });

  /** Mutate + persist immediately (used for inbox actions, credentials). */
  const mutateAndSave = (fn: (d: SiteData) => void) =>
    setWorking((prev) => {
      const next = clone(prev);
      fn(next);
      save(next);
      return next;
    });

  const saveAll = () => {
    save(working);
    toast.success("All changes saved");
  };

  const jump = (t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ctrl/Cmd+S to save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save(working);
        toast.success("All changes saved");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [working, save]);

  const unread = working.messages.filter((m) => !m.read).length;
  const links: { id: TabId; icon: string; label: string; count?: number }[] = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "general", icon: "⚙️", label: "Site" },
    { id: "about", icon: "👤", label: "About" },
    { id: "categories", icon: "🗂️", label: "Categories", count: working.serviceCategories.length },
    { id: "services", icon: "🧰", label: "Services", count: working.services.length },
    { id: "blog", icon: "📝", label: "Blog", count: working.blog.length },
    { id: "contact", icon: "✉️", label: "Contact", count: unread || working.messages.length },
    { id: "settings", icon: "🔧", label: "Settings" },
  ];

  const props: SectionProps = { working, setWorking, mutate, mutateAndSave, jump, editingPostId, setEditingPostId };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="z-20 flex flex-col border-b border-sidebar-border bg-sidebar lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="border-b border-primary/10 p-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-widest text-primary">&gt;_ {working.site.name}</Link>
            <Button variant="ghost" size="xs" className="lg:hidden" onClick={logout}>✕</Button>
          </div>
          <p className="mt-1 text-[10px] tracking-widest text-primary/30">// ADMIN PANEL</p>
          <p className="mt-2 text-[10px] text-primary/50">
            Logged in as <span className="text-primary">{working.admin.username}</span>
          </p>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-y-auto">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => jump(l.id)}
              data-active={tab === l.id}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left text-sm text-primary/60 transition-colors hover:bg-accent hover:text-primary",
                "data-[active=true]:border-primary/30 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              )}
            >
              <span>{l.icon}</span>
              <span className="flex-1">{l.label}</span>
              {l.count !== undefined && (
                <span className="rounded-full bg-primary/10 px-2 text-[10px] group-data-[active=true]:bg-primary group-data-[active=true]:text-primary-foreground">
                  {l.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="hidden flex-col gap-2 border-t border-primary/10 p-3 lg:flex">
          <Link href="/" target="_blank" className="rounded-md px-3 py-1.5 text-sm text-primary/70 hover:bg-accent hover:text-primary">↗ View Site</Link>
          <Button variant="ghost" size="sm" className="justify-start" onClick={logout}>⎋ Log out</Button>
          <Button size="sm" className="tracking-widest" onClick={saveAll}>[ SAVE ALL ]</Button>
        </div>
      </aside>

      <main className="w-full max-w-5xl flex-1 p-4 lg:ml-64 lg:p-8">
        {tab === "dashboard" && <DashboardSection {...props} />}
        {tab === "general" && <GeneralSection {...props} />}
        {tab === "about" && <AboutSection {...props} />}
        {tab === "categories" && <CategoriesSection {...props} />}
        {tab === "services" && <ServicesSection {...props} />}
        {tab === "blog" && <BlogSection {...props} />}
        {tab === "contact" && <ContactSection {...props} />}
        {tab === "settings" && <SettingsSection {...props} />}
      </main>

      <div className="fixed bottom-4 right-4 z-30">
        <Button size="lg" onClick={saveAll} className="shadow-[0_0_30px_-5px_rgba(0,255,156,0.6)]">💾 SAVE</Button>
      </div>
    </div>
  );
}

export function AdminApp() {
  const { hydrated, isAdmin } = useSiteData();
  if (!hydrated) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-primary/40">Loading…</div>;
  }
  return <ConfirmProvider>{isAdmin ? <Dashboard /> : <LoginGate />}</ConfirmProvider>;
}
