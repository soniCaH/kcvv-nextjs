import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: {
    template: "%s | KCVV Elewijt",
    default: "KCVV Elewijt - Officiële Website",
  },
  description: "KCVV Elewijt voetbalclub met stamnummer 55 - Er is maar één plezante compagnie",
  keywords: ["KCVV Elewijt", "voetbal", "football", "Elewijt", "voetbalclub"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/* Adobe Typekit Fonts */}
        <Script
          src={`https://use.typekit.net/${process.env.NEXT_PUBLIC_TYPEKIT_ID}.js`}
          strategy="beforeInteractive"
        />
        <Script id="typekit-init" strategy="beforeInteractive">
          {`try{Typekit.load({ async: true });}catch(e){console.error('Typekit load error:', e);}`}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <PageHeader />
        {children}
        <PageFooter />
      </body>
    </html>
  );
}
