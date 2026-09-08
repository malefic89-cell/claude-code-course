import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { t } from "@/lib/i18n";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: t.siteTitle,
  description: t.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <header className="border-b-2 border-ink">
          <div className="mx-auto flex max-w-6xl items-baseline justify-between px-5 py-5 sm:px-10 lg:px-16">
            <Link href="/" className="font-serif text-xl font-bold hover:text-accent">
              {t.siteTitle}
            </Link>
            <Link
              href="/#programme"
              className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink"
            >
              {t.nav.programme}
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
