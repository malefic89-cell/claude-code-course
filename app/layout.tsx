import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { t } from "@/lib/i18n";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
            <Link href="/" className="font-semibold hover:text-emerald-700">
              {t.siteTitle}
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
