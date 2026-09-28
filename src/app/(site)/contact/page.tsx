import type { Metadata } from "next";
import { ContactContent } from "@/components/site/contact-content";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <ContactContent />;
}
