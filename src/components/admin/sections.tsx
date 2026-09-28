"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "@/components/site/blog-card";
import { estimateReadTime, formatDate } from "@/lib/helpers";
import { useSiteData } from "@/lib/store";
import type { BlogPost, SiteData } from "@/lib/types";
import type { TabId } from "./admin-app";
import { useConfirm } from "./confirm-dialog";
import { CommaListInput, DeleteButton, Field, Panel, PanelTitle, SectionHeader } from "./ui";

export interface SectionProps {
  working: SiteData;
  setWorking: React.Dispatch<React.SetStateAction<SiteData>>;
  mutate: (fn: (d: SiteData) => void) => void;
  mutateAndSave: (fn: (d: SiteData) => void) => void;
  jump: (t: TabId) => void;
  editingPostId: string | null;
  setEditingPostId: (id: string | null) => void;
}

// ---------- shared actions ----------
function newPost(): BlogPost {
  return {
    id: String(Date.now()),
    title: "Untitled Post",
    excerpt: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
    image: "",
    tags: [],
    category: "cyber",
    featured: false,
  };
}

function addCategory(mutate: SectionProps["mutate"]) {
  mutate((d) => d.serviceCategories.push({ id: "cat" + Date.now(), icon: "📦", name: "New Category", desc: "" }));
}

function addService(mutate: SectionProps["mutate"]) {
  mutate((d) =>
    d.services.push({
      category: d.serviceCategories[0]?.id ?? "",
      icon: "🔧",
      title: "New Service",
      desc: "Description here.",
      tags: ["Tag"],
    })
  );
}

// ============================================================
// DASHBOARD
// ============================================================
export function DashboardSection({ working, mutate, jump, setEditingPostId }: SectionProps) {
  const stats = [
    { icon: "🗂️", value: working.serviceCategories.length, label: "Categories" },
    { icon: "🧰", value: working.services.length, label: "Services" },
    { icon: "📝", value: working.blog.length, label: "Blog Posts" },
    { icon: "✉️", value: working.messages.length, label: "Messages" },
  ];

  const actions = [
    {
      label: "New Blog Post",
      icon: "➕",
      run: () => {
        const p = newPost();
        mutate((d) => d.blog.unshift(p));
        setEditingPostId(p.id);
        jump("blog");
      },
    },
    { label: "New Service", icon: "➕", run: () => (addService(mutate), jump("services")) },
    { label: "New Category", icon: "➕", run: () => (addCategory(mutate), jump("categories")) },
    { label: "Backup Data", icon: "💾", run: () => jump("settings") },
  ];

  return (
    <section>
      <SectionHeader eyebrow="// Overview" title="Dashboard" desc="Manage everything about your website from one place." />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label} className="transition-colors hover:border-primary/40">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-2 text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-primary/40">{s.label}</div>
          </Panel>
        ))}
      </div>

      <Panel className="mb-6">
        <PanelTitle className="mb-4">// Quick Actions</PanelTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.run}
              className="flex flex-col items-center gap-2 rounded-md border border-primary/15 p-4 text-sm text-primary/70 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
              <span className="text-2xl">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-4">// Recent Posts</PanelTitle>
        <div className="flex flex-col gap-2">
          {!working.blog.length && <p className="text-sm text-primary/40">No posts yet.</p>}
          {working.blog.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded border border-primary/10 p-3 transition-colors hover:border-primary/30">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-primary">{p.title}</p>
                <p className="text-[10px] text-primary/40">{p.date}</p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setEditingPostId(p.id);
                  jump("blog");
                }}
              >
                edit
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

// ============================================================
// GENERAL (site identity)
// ============================================================
export function GeneralSection({ working, mutate }: SectionProps) {
  const s = working.site;
  const set = (k: keyof SiteData["site"]) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    mutate((d) => {
      d.site[k] = e.target.value;
    });

  return (
    <section>
      <SectionHeader eyebrow="// Site" title="Site Identity" />
      <Panel className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Site Name"><Input value={s.name} onChange={set("name")} /></Field>
          <Field label="Tagline"><Input value={s.tagline} onChange={set("tagline")} /></Field>
          <Field label="Hero — Line 1"><Input value={s.heroTitle1} onChange={set("heroTitle1")} /></Field>
          <Field label="Hero — Line 2 (accent)"><Input value={s.heroTitle2} onChange={set("heroTitle2")} /></Field>
        </div>
        <Field label="Hero Subtitle"><Textarea rows={2} className="resize-none" value={s.heroSub} onChange={set("heroSub")} /></Field>
        <Field label="Footer Text"><Input value={s.footer} onChange={set("footer")} /></Field>
      </Panel>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
export function AboutSection({ working, mutate }: SectionProps) {
  const a = working.about;
  const set = (k: "name" | "role" | "initials" | "bio") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    mutate((d) => {
      d.about[k] = e.target.value;
    });
  const [skillsRaw, setSkillsRaw] = useState(a.skills.join("\n"));

  return (
    <section>
      <SectionHeader eyebrow="// Profile" title="About" />
      <Panel className="mb-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Full Name"><Input value={a.name} onChange={set("name")} /></Field>
          <Field label="Role"><Input value={a.role} onChange={set("role")} /></Field>
          <Field label="Initials"><Input value={a.initials} maxLength={3} onChange={set("initials")} /></Field>
        </div>
        <Field label="Bio"><Textarea rows={4} className="resize-none" value={a.bio} onChange={set("bio")} /></Field>
      </Panel>

      <Panel className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <PanelTitle>// Stats</PanelTitle>
          <Button
            variant="outline"
            size="xs"
            onClick={() => mutate((d) => d.about.stats.push({ title: "New", value: "Value", desc: "Description" }))}
          >
            + Add
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {!a.stats.length && <p className="text-sm text-primary/40">No stats yet.</p>}
          {a.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-2 rounded-md border border-primary/10 p-2 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
              {(["title", "value", "desc"] as const).map((k) => (
                <Input
                  key={k}
                  value={s[k]}
                  placeholder={k === "desc" ? "Description" : k[0].toUpperCase() + k.slice(1)}
                  onChange={(e) => mutate((d) => { d.about.stats[i][k] = e.target.value; })}
                />
              ))}
              <DeleteButton onClick={() => mutate((d) => { d.about.stats.splice(i, 1); })} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <PanelTitle>// Skills</PanelTitle>
          <span className="text-xs text-primary/40">one per line</span>
        </div>
        <Textarea
          rows={8}
          className="resize-none"
          value={skillsRaw}
          onChange={(e) => {
            setSkillsRaw(e.target.value);
            const list = e.target.value.split("\n").map((x) => x.trim()).filter(Boolean);
            mutate((d) => { d.about.skills = list; });
          }}
        />
      </Panel>
    </section>
  );
}

// ============================================================
// CATEGORIES
// ============================================================
export function CategoriesSection({ working, mutate }: SectionProps) {
  const confirm = useConfirm();

  const remove = async (i: number) => {
    const cat = working.serviceCategories[i];
    const affected = working.services.filter((s) => s.category === cat.id).length;
    const ok = await confirm(
      affected
        ? `Delete category "${cat.name}"? ${affected} service(s) will become uncategorized.`
        : `Delete category "${cat.name}"?`
    );
    if (!ok) return;
    mutate((d) => {
      d.serviceCategories.splice(i, 1);
      d.services.forEach((s) => {
        if (s.category === cat.id) s.category = "";
      });
    });
  };

  return (
    <section>
      <SectionHeader
        eyebrow="// Grouping"
        title="Categories"
        desc="Groups shown on the Services page."
        action={<Button size="sm" className="tracking-widest" onClick={() => addCategory(mutate)}>+ NEW CATEGORY</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!working.serviceCategories.length && <p className="col-span-full text-sm text-primary/40">No categories yet.</p>}
        {working.serviceCategories.map((c, i) => (
          <Panel key={c.id} className="transition-colors hover:border-primary/35">
            <div className="flex items-start gap-3">
              <Input
                value={c.icon}
                onChange={(e) => mutate((d) => { d.serviceCategories[i].icon = e.target.value; })}
                className="h-14 w-14 shrink-0 text-center text-2xl"
              />
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  value={c.name}
                  placeholder="Category name"
                  className="font-bold"
                  onChange={(e) => mutate((d) => { d.serviceCategories[i].name = e.target.value; })}
                />
                <Input
                  value={c.desc}
                  placeholder="Short description"
                  className="text-xs"
                  onChange={(e) => mutate((d) => { d.serviceCategories[i].desc = e.target.value; })}
                />
              </div>
              <DeleteButton onClick={() => remove(i)} />
            </div>
            <p className="mt-3 text-[10px] text-primary/25">id: <code>{c.id}</code></p>
          </Panel>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
export function ServicesSection({ working, mutate }: SectionProps) {
  const confirm = useConfirm();
  const [filter, setFilter] = useState("all");

  const list = working.services
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => filter === "all" || s.category === filter);

  const remove = async (i: number) => {
    if (!(await confirm(`Delete service "${working.services[i].title}"?`))) return;
    mutate((d) => { d.services.splice(i, 1); });
  };

  return (
    <section>
      <SectionHeader
        eyebrow="// Offerings"
        title="Services"
        desc="Everything you offer clients."
        action={<Button size="sm" className="tracking-widest" onClick={() => addService(mutate)}>+ NEW SERVICE</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs tracking-widest text-primary/40">Filter:</span>
        <div className="w-72">
          <NativeSelect value={filter} onChange={(e) => setFilter(e.target.value)} className="h-8 text-xs">
            <option value="all">All categories ({working.services.length})</option>
            {working.serviceCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name} ({working.services.filter((s) => s.category === c.id).length})
              </option>
            ))}
            <option value="">Uncategorized</option>
          </NativeSelect>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {!list.length && <p className="text-sm text-primary/40">No services in this view.</p>}
        {list.map(({ s, i }) => (
          <Panel key={i} className="transition-colors hover:border-primary/35">
            <div className="flex items-start gap-3">
              <Input
                value={s.icon}
                onChange={(e) => mutate((d) => { d.services[i].icon = e.target.value; })}
                className="h-14 w-14 shrink-0 text-center text-2xl"
              />
              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_220px]">
                  <Input
                    value={s.title}
                    placeholder="Service title"
                    className="font-bold"
                    onChange={(e) => mutate((d) => { d.services[i].title = e.target.value; })}
                  />
                  <NativeSelect
                    value={s.category}
                    className="text-xs"
                    onChange={(e) => mutate((d) => { d.services[i].category = e.target.value; })}
                  >
                    <option value="">— Uncategorized —</option>
                    {working.serviceCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </NativeSelect>
                </div>
                <Textarea
                  rows={2}
                  className="resize-none"
                  value={s.desc}
                  placeholder="Description"
                  onChange={(e) => mutate((d) => { d.services[i].desc = e.target.value; })}
                />
                <CommaListInput
                  value={s.tags}
                  placeholder="tags, comma, separated"
                  className="text-xs"
                  onChange={(tags) => mutate((d) => { d.services[i].tags = tags; })}
                />
              </div>
              <DeleteButton onClick={() => remove(i)} />
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// BLOG
// ============================================================
export function BlogSection(props: SectionProps) {
  const { working, mutate, editingPostId, setEditingPostId } = props;
  const confirm = useConfirm();

  const remove = async (id: string) => {
    const post = working.blog.find((p) => p.id === id);
    if (!post || !(await confirm(`Delete post "${post.title}"?`))) return;
    mutate((d) => { d.blog = d.blog.filter((p) => p.id !== id); });
    if (editingPostId === id) setEditingPostId(null);
  };

  const editing = working.blog.find((p) => p.id === editingPostId);
  if (editing) return <PostEditor {...props} post={editing} onDelete={() => remove(editing.id)} />;

  return (
    <section>
      <SectionHeader
        eyebrow="// Writing"
        title="Blog Posts"
        desc="Write-ups and articles."
        action={
          <Button
            size="sm"
            className="tracking-widest"
            onClick={() => {
              const p = newPost();
              mutate((d) => d.blog.unshift(p));
              setEditingPostId(p.id);
            }}
          >
            + NEW POST
          </Button>
        }
      />
      <div className="flex flex-col gap-3">
        {!working.blog.length && <p className="text-sm text-primary/40">No posts yet. Click + NEW POST to create one.</p>}
        {working.blog.map((p) => (
          <div
            key={p.id}
            onClick={() => setEditingPostId(p.id)}
            className="flex cursor-pointer items-center gap-4 rounded-lg border border-primary/15 bg-card p-3 transition-colors hover:border-primary/40"
          >
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.image ? <img src={p.image} alt="" className="size-full object-cover" /> : "📄"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <CategoryBadge category={p.category} />
                {p.featured && <span className="text-yellow-400" title="Featured">★</span>}
              </div>
              <h4 className="truncate font-bold text-white">{p.title}</h4>
              <p className="truncate text-xs text-primary/50">{p.excerpt || p.content}</p>
              <div className="mt-1 flex gap-2 text-[10px] text-primary/40">
                <span>{formatDate(p.date)}</span>•<span>{estimateReadTime(p.content || p.excerpt)}</span>
                {p.tags.length > 0 && <>•<span>{p.tags.length} tags</span></>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="xs" className="hidden sm:inline-flex" onClick={() => setEditingPostId(p.id)}>✎ Edit</Button>
              <DeleteButton onClick={() => remove(p.id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PostEditor({ working, mutate, setEditingPostId, post, onDelete }: SectionProps & { post: BlogPost; onDelete: () => void }) {
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const idx = working.blog.findIndex((p) => p.id === post.id);

  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) =>
    mutate((d) => {
      const p = d.blog.find((x) => x.id === post.id);
      if (p) p[k] = v;
    });

  const setFeatured = (val: boolean) =>
    mutate((d) => d.blog.forEach((p) => (p.featured = p.id === post.id ? val : val ? false : p.featured)));

  const addTag = () => {
    const val = tagInput.trim().replace(/^#/, "").replace(/\s+/g, "-").toLowerCase();
    setTagInput("");
    if (!val || post.tags.includes(val)) return;
    set("tags", [...post.tags, val]);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) return void toast.error("Image too large (max 1.5 MB)");
    const reader = new FileReader();
    reader.onload = () => {
      set("image", String(reader.result));
      toast.success("Image attached (remember to SAVE)");
    };
    reader.readAsDataURL(file);
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 pb-4">
        <Button variant="ghost" size="sm" onClick={() => setEditingPostId(null)}>← Back to list</Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary/40">
            Editing post <code className="text-primary">#{String(idx + 1).padStart(2, "0")}</code>
          </span>
          <Button variant="destructive" size="xs" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Field label="Title">
            <Input value={post.title} placeholder="Post title" className="h-11 text-lg font-bold" onChange={(e) => set("title", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date">
              <Input type="date" value={post.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Category">
              <NativeSelect value={post.category} onChange={(e) => set("category", e.target.value as BlogPost["category"])}>
                <option value="cyber">🛡️ Cybersecurity</option>
                <option value="support">🖥️ IT Support</option>
                <option value="other">📁 Other</option>
              </NativeSelect>
            </Field>
          </div>
          <Field label="Featured" hint="show as hero">
            <div className="flex items-center gap-3 rounded-md border border-primary/15 bg-secondary px-3 py-2.5">
              <Switch checked={post.featured} onCheckedChange={(v: boolean) => setFeatured(v)} />
              <span className="text-xs text-primary/70">
                {post.featured ? "This post appears as the featured hero" : "Not featured"}
              </span>
            </div>
          </Field>
          <Field label="Excerpt" hint="short summary for cards">
            <Textarea rows={2} className="resize-none" value={post.excerpt} placeholder="One or two sentences..." onChange={(e) => set("excerpt", e.target.value)} />
          </Field>
          <Field label="Content" hint="full article body">
            <Textarea rows={14} className="resize-y leading-7" value={post.content} placeholder="Write the full article here..." onChange={(e) => set("content", e.target.value)} />
          </Field>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-primary/50">Cover Image</span>
              {post.image && (
                <span className="text-[10px] text-primary/40">{post.image.startsWith("data:") ? "uploaded file" : "external url"}</span>
              )}
            </div>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-dashed border-primary/25 bg-secondary">
              {post.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-primary/30">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="xs" onClick={() => fileRef.current?.click()}>📁 Upload file</Button>
              <Button variant="ghost" size="xs" onClick={() => set("image", "")}>✕ Clear</Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </div>
            <Field label="Or paste image URL">
              <Input
                value={post.image.startsWith("data:") ? "" : post.image}
                placeholder="https://example.com/image.jpg"
                className="text-xs"
                onChange={(e) => set("image", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-primary/50">Tags</span>
              <span className="text-[10px] text-primary/30">{post.tags.length} total</span>
            </div>
            <div className="flex min-h-8 flex-wrap gap-2">
              {!post.tags.length && <span className="text-xs italic text-primary/30">No tags yet</span>}
              {post.tags.map((t) => (
                <Badge key={t} variant="outline" className="gap-1 border-primary/40 text-primary">
                  #{t}
                  <button className="text-primary/50 hover:text-red-400" onClick={() => set("tags", post.tags.filter((x) => x !== t))} title="Remove">✕</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                placeholder="add tag and press Enter"
                className="text-xs"
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={addTag}>+ Add</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[0.65rem] uppercase tracking-[0.15em] text-primary/50">Live Card Preview</span>
            <div className="overflow-hidden rounded-lg border border-primary/20 bg-card">
              <div className="flex aspect-video items-center justify-center bg-secondary">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt="" className="size-full object-cover" />
                ) : (
                  <span className="tracking-[0.4em] text-primary/30">{working.site.name}</span>
                )}
              </div>
              <div className="p-4">
                <div className="text-[10px] text-primary/40">
                  {formatDate(post.date)} · {estimateReadTime(post.content || post.excerpt)}
                </div>
                <h5 className="mt-1 font-bold text-white">{post.title || "Untitled"}</h5>
                <p className="mt-1 line-clamp-2 text-xs text-primary/60">{post.excerpt || post.content || "No excerpt yet."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT + INBOX
// ============================================================
export function ContactSection({ working, mutate, mutateAndSave }: SectionProps) {
  const confirm = useConfirm();
  const c = working.contact;
  const set = (k: keyof SiteData["contact"]) => (e: React.ChangeEvent<HTMLInputElement>) =>
    mutate((d) => { d.contact[k] = e.target.value; });

  return (
    <section>
      <SectionHeader eyebrow="// Messaging" title="Contact" desc="Contact details and incoming messages." />

      <Panel className="mb-6 flex max-w-2xl flex-col gap-5">
        <PanelTitle>// Contact Details</PanelTitle>
        <Field label="Email Address"><Input value={c.email} onChange={set("email")} placeholder="admin@akrvyensec.com" /></Field>
        <Field label="GitHub URL"><Input value={c.github} onChange={set("github")} placeholder="https://github.com/username" /></Field>
        <Field label="LinkedIn URL"><Input value={c.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/username" /></Field>
        <Field label="Encrypted note"><Input value={c.encrypted} onChange={set("encrypted")} /></Field>
        <Field label="Response time note"><Input value={c.responseTime} onChange={set("responseTime")} /></Field>
      </Panel>

      <Panel className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <PanelTitle>// Inbox</PanelTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                mutateAndSave((d) => d.messages.forEach((m) => (m.read = true)));
                toast.success("All marked read");
              }}
            >
              Mark all read
            </Button>
            <Button
              variant="destructive"
              size="xs"
              onClick={async () => {
                if (!(await confirm("Delete ALL messages? This cannot be undone.", { confirmLabel: "Clear inbox" }))) return;
                mutateAndSave((d) => { d.messages = []; });
                toast.success("Inbox cleared");
              }}
            >
              Clear all
            </Button>
          </div>
        </div>
        <p className="mb-4 text-xs text-primary/40">
          Messages submitted via the contact form are stored in your browser. Email delivery is handled separately by Formspree.
        </p>
        <div className="flex flex-col gap-2">
          {!working.messages.length && <p className="text-sm text-primary/40">No messages yet.</p>}
          {working.messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-md border p-4 ${m.read ? "border-primary/10 opacity-70" : "border-primary/40 bg-primary/5"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-primary">{m.name || "Unknown"}</span>
                    {!m.read && <Badge className="h-4 px-1.5 text-[9px]">NEW</Badge>}
                    <span className="text-[10px] text-primary/40">{m.date.slice(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="mt-1 text-xs text-primary/70">
                    ✉ <a href={`mailto:${m.email}`} className="underline">{m.email}</a>
                    {m.service && ` · ${m.service}`}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-primary/80">{m.message}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={m.read ? "Mark unread" : "Mark read"}
                    onClick={() => mutateAndSave((d) => {
                      const x = d.messages.find((y) => y.id === m.id);
                      if (x) x.read = !x.read;
                    })}
                  >
                    {m.read ? "◯" : "●"}
                  </Button>
                  <DeleteButton
                    onClick={async () => {
                      if (!(await confirm("Delete this message?"))) return;
                      mutateAndSave((d) => { d.messages = d.messages.filter((y) => y.id !== m.id); });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

// ============================================================
// SETTINGS
// ============================================================
export function SettingsSection({ working, setWorking, mutateAndSave }: SectionProps) {
  const { save, reset } = useSiteData();
  const confirm = useConfirm();
  const [user, setUser] = useState(working.admin.username);
  const [pass, setPass] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const changeCreds = () => {
    if (!user.trim()) return void toast.error("Username empty");
    if (!pass.trim()) return void toast.error("Password empty");
    mutateAndSave((d) => { d.admin = { username: user.trim(), password: pass.trim() }; });
    setPass("");
    toast.success("Credentials updated");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(working, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `akrvyensec-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteData;
        save(parsed);
        setWorking(parsed);
        toast.success("Imported");
      } catch {
        toast.error("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  const resetAll = async () => {
    if (!(await confirm("Reset ALL content to defaults? This cannot be undone.", { confirmLabel: "Reset" }))) return;
    reset();
    toast.success("Reset — reloading");
    setTimeout(() => location.reload(), 600);
  };

  return (
    <section>
      <SectionHeader eyebrow="// System" title="Settings" />
      <Panel className="mb-6 max-w-xl">
        <PanelTitle className="mb-4">// Credentials</PanelTitle>
        <div className="flex flex-col gap-3">
          <Field label="Username"><Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" /></Field>
          <Field label="New Password"><Input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="new password" /></Field>
          <Button size="sm" className="self-start tracking-widest" onClick={changeCreds}>[ UPDATE CREDENTIALS ]</Button>
        </div>
      </Panel>

      <Panel className="max-w-xl">
        <PanelTitle className="mb-4">// Backup &amp; Restore</PanelTitle>
        <div className="flex flex-col gap-3">
          <Button variant="outline" size="sm" className="justify-start" onClick={exportData}>⬇ Export JSON — download all content</Button>
          <Button variant="outline" size="sm" className="justify-start" onClick={() => importRef.current?.click()}>⬆ Import JSON — restore from backup</Button>
          <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={importData} />
          <Button variant="destructive" size="sm" className="justify-start" onClick={resetAll}>⚠ Reset to defaults — erase all edits</Button>
        </div>
        <p className="mt-4 text-xs leading-6 text-primary/40">
          Content is stored in your browser&apos;s localStorage. To make changes permanent for all visitors, export JSON and paste it into{" "}
          <code className="text-primary">DEFAULT_DATA</code> in <code className="text-primary">src/lib/default-data.ts</code>.
        </p>
      </Panel>
    </section>
  );
}
