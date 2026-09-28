import type { BlogPost } from "./types";

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function estimateReadTime(text: string): string {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function categoryLabel(cat: BlogPost["category"]): string {
  if (cat === "support") return "IT Support";
  if (cat === "other") return "Other";
  return "Cybersecurity";
}

export function handleFromUrl(url: string): string {
  return url.split("/").filter(Boolean).pop() ?? "";
}

export function deepMerge<T>(target: T, source: unknown): T {
  if (!source || typeof source !== "object") return target;
  const t = target as Record<string, unknown>;
  for (const [key, val] of Object.entries(source as Record<string, unknown>)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      t[key] = deepMerge((t[key] as object) ?? {}, val);
    } else {
      t[key] = val;
    }
  }
  return target;
}

export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
