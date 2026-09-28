"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSiteData } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Security Tools", isNew: true },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const { data } = useSiteData();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-card/90 backdrop-blur">
      <nav className="mx-auto flex h-16 items-center gap-2 px-4">
        <button
          className="lg:hidden rounded p-2 hover:bg-accent"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/" className="px-2 text-xl tracking-[0.15em] text-primary">
          &gt;_ {data.site.name}
        </Link>

        <ul className="mx-auto hidden items-center lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                data-active={pathname === n.href}
                className="nav-underline block px-3 py-2 text-sm tracking-widest text-primary/70 hover:text-primary data-[active=true]:text-primary"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <span className="flex items-center gap-2 text-xs text-primary/50">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            Systems Online
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Link href="/contact" className={cn(buttonVariants({ size: "sm" }), "tracking-widest")}>
            [ CONTACT ]
          </Link>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-primary/10 bg-card p-2 lg:hidden">
          {[...NAV, { href: "/contact", label: "Contact" }].map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-accent",
                  pathname === n.href && "bg-accent"
                )}
              >
                {n.label}
                {"isNew" in n && n.isNew && <Badge className="h-4 px-1.5 text-[10px]">New</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
