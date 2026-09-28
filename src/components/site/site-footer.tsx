"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/store";

export function SiteFooter() {
  const { data } = useSiteData();
  return (
    <footer className="border-t border-primary/10 py-6 text-center text-xs tracking-widest text-primary/40">
      <span>{data.site.footer}</span> — <span className="text-primary/20">All rights reserved</span>
      <Link href="/admin" className="ml-2 underline hover:text-primary">
        [admin]
      </Link>
    </footer>
  );
}
