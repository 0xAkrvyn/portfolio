"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { estimateReadTime, formatDate } from "@/lib/helpers";
import { useSiteData } from "@/lib/store";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BlogCard, CategoryBadge, Cover, Tag } from "./blog-card";
import { FilterButton } from "./filter-button";

type CatFilter = "all" | "cyber" | "support";

export function BlogContent() {
  const { data } = useSiteData();
  const brand = data.site.name;
  const [category, setCategory] = useState<CatFilter>("all");
  const [tag, setTag] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const inCat = (p: BlogPost) => category === "all" || p.category === category;

  const tabs = [
    { id: "all" as const, label: "All Posts", count: data.blog.length },
    { id: "cyber" as const, label: "Cybersecurity", count: data.blog.filter((p) => p.category === "cyber").length },
    { id: "support" as const, label: "IT Support", count: data.blog.filter((p) => p.category === "support").length },
  ];

  const tags = useMemo(() => {
    const s = new Set<string>();
    data.blog.filter(inCat).forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.blog, category]);

  const featured = data.blog.find((p) => p.featured && inCat(p));
  const featuredId = data.blog.find((p) => p.featured)?.id;

  const q = search.toLowerCase().trim();
  const posts = data.blog.filter((p) => {
    if (p.id === featuredId) return false;
    if (!inCat(p)) return false;
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    const hay = `${p.title} ${p.excerpt} ${p.content} ${p.tags.join(" ")}`.toLowerCase();
    return !q || hay.includes(q);
  });

  const openPost = data.blog.find((p) => p.id === openId);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-16 text-center">
        <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-primary/40">// Research &amp; Write-ups</p>
        <h1 className="mb-3 text-4xl font-bold text-primary md:text-5xl">Cyber Journal</h1>
        <p className="mx-auto max-w-xl text-sm text-primary/50">
          Notes on offensive security, IT support, networking, and everything in between.
        </p>
      </section>

      {/* Category tabs */}
      <section className="mx-auto mb-8 flex w-full max-w-6xl flex-wrap justify-center gap-2 px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setCategory(t.id);
              setTag("all");
            }}
            data-active={category === t.id}
            className="group flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-xs uppercase tracking-widest text-primary/60 transition-colors hover:border-primary/50 hover:text-primary data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
          >
            <span>{t.label}</span>
            <span className="rounded-full bg-primary/10 px-2 text-[10px] group-data-[active=true]:bg-primary group-data-[active=true]:text-primary-foreground">
              {t.count}
            </span>
          </button>
        ))}
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto mb-10 w-full max-w-6xl px-4">
          <article
            onClick={() => setOpenId(featured.id)}
            className="group grid cursor-pointer overflow-hidden rounded-xl border border-primary/25 bg-card transition-all hover:border-primary/60 hover:glow md:grid-cols-2"
          >
            <Cover post={featured} brand={brand} className="aspect-video md:aspect-auto md:min-h-80" />
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <CategoryBadge category={featured.category} />
                <span className="text-xs tracking-widest text-yellow-400">★ Featured</span>
              </div>
              <div className="flex gap-2 text-xs text-primary/40">
                <span>{formatDate(featured.date)}</span>
                <span>•</span>
                <span>{estimateReadTime(featured.content || featured.excerpt)}</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white group-hover:text-primary md:text-3xl">
                {featured.title}
              </h2>
              <p className="text-sm leading-7 text-primary/60">{featured.excerpt || featured.content}</p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.slice(0, 5).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="mt-auto text-sm text-primary/70 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                Read the full article →
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Search + tags */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/40" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="pl-10" />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["all", ...tags].map((t) => (
                <FilterButton key={t} active={tag === t} onClick={() => setTag(t)}>
                  {t === "all" ? "All Topics" : `#${t}`}
                </FilterButton>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20">
        {posts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.id} post={p} brand={brand} onOpen={() => setOpenId(p.id)} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-sm text-primary/40">No posts match your search.</p>
          </div>
        )}
      </main>

      <Dialog open={!!openPost} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 ring-primary/30 sm:max-w-3xl">
          {openPost && (
            <>
              {openPost.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={openPost.image} alt={openPost.title} className="max-h-80 w-full object-cover" />
              )}
              <div className={cn("flex flex-col gap-4 p-6 md:p-10")}>
                <div className="flex items-center gap-3 pr-8">
                  <CategoryBadge category={openPost.category} />
                  <span className="text-xs text-primary/40">{formatDate(openPost.date)}</span>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight text-white md:text-3xl">
                  {openPost.title}
                </DialogTitle>
                <p className="text-xs text-primary/40">{estimateReadTime(openPost.content || openPost.excerpt)}</p>
                {openPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {openPost.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap border-t border-primary/10 pt-5 text-[15px] leading-8 text-primary/80">
                  {openPost.content || openPost.excerpt}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
