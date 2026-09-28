import type { Metadata } from "next";
import { BlogContent } from "@/components/site/blog-content";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return <BlogContent />;
}
