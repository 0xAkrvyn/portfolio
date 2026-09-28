"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteData } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FilterButton } from "./filter-button";
import { PageHeading } from "./page-heading";

export function ServicesContent() {
  const { data } = useSiteData();
  const [active, setActive] = useState("all");

  const filters = [{ id: "all", icon: "◆", name: "All Services" }, ...data.serviceCategories];
  const cats = data.serviceCategories.filter((c) => active === "all" || c.id === active);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-20">
      <PageHeading eyebrow="// Full IT Solutions" title="Services">
        From cybersecurity audits to everyday IT support — pick a category below or browse everything.
      </PageHeading>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((c) => (
          <FilterButton key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
            {c.icon} {c.name}
          </FilterButton>
        ))}
      </div>

      <div className="mb-16 flex flex-col gap-2">
        {!cats.length && <p className="text-sm text-primary/40">No services yet.</p>}
        {cats.map((cat) => {
          const items = data.services.filter((s) => s.category === cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id} className="w-full">
              <div className="mb-4 mt-10 flex items-center gap-3 border-b border-primary/15 pb-3">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold tracking-wide text-primary">{cat.name}</h2>
                <span className="ml-auto hidden text-xs text-primary/40 sm:block">{cat.desc}</span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <Card
                    key={s.title}
                    className="ring-primary/20 transition-all hover:-translate-y-0.5 hover:ring-primary/50 hover:glow"
                  >
                    <CardContent className="flex h-full flex-col gap-2 p-6">
                      <div className="text-3xl">{s.icon}</div>
                      <h3 className="text-base font-bold text-primary">{s.title}</h3>
                      <p className="flex-1 text-sm leading-7 text-primary/60">{s.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.tags.map((t) => (
                          <Badge key={t} variant="outline" className="border-primary/40 text-primary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Card className="flex-col items-center justify-between gap-4 px-6 ring-primary/20 sm:flex-row">
        <div>
          <p className="font-bold text-primary">Need help with something specific?</p>
          <p className="text-sm text-primary/50">Describe your issue and get a free consultation.</p>
        </div>
        <Link href="/contact" className={cn(buttonVariants({ size: "sm" }), "shrink-0 tracking-widest")}>
          [ REQUEST ]
        </Link>
      </Card>
    </main>
  );
}
