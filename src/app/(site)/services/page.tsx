import type { Metadata } from "next";
import { ServicesContent } from "@/components/site/services-content";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <ServicesContent />;
}
