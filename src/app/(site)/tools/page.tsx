import type { Metadata } from "next";
import { ToolsContent } from "@/components/site/tools-content";

export const metadata: Metadata = { title: "Security Tools" };

export default function ToolsPage() {
  return <ToolsContent />;
}
