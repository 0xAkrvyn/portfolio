import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import { SiteDataProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akrvyensec.com"),
  title: { default: "AKRVYENSEC", template: "%s - AKRVYENSEC" },
  description:
    "Cybersecurity research, IT support, networking, and web solutions — all under one roof.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${shareTech.variable} antialiased min-h-screen`}>
        <SiteDataProvider>
          {children}
          <Toaster theme="dark" position="bottom-center" />
        </SiteDataProvider>
      </body>
    </html>
  );
}
