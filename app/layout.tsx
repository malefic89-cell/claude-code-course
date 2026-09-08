import type { Metadata } from "next";
import Link from "next/link";
import { getModules, getModuleTasks } from "@/lib/content";
import { t } from "@/lib/i18n";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import CourseRail, { type RailModule } from "@/components/CourseRail";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: t.siteTitle,
  description: t.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Рейке нужны только id и названия — без Markdown-тел задач.
  const railModules: RailModule[] = getModules().map((m) => ({
    id: m.id,
    title: m.title,
    tasks: getModuleTasks(m.id).map(({ id, title }) => ({ id, title })),
  }));
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Тема выставляется до первой отрисовки, чтобы страница не мигала белым. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <header className="border-b-2 border-ink">
          <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-5 py-5 sm:px-10">
            <Link href="/" className="font-serif text-xl font-bold hover:text-accent">
              {t.siteTitle}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/#programme"
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink"
              >
                {t.nav.programme}
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
          <CourseRail modules={railModules} />
          {children}
        </div>
      </body>
    </html>
  );
}
