"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProgrammeLinkProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Ссылка на блок «Программа» на главной.
 * На самой главной — обычный якорь: браузер прокручивает при каждом клике,
 * тогда как Link при неизменном адресе «/#programme» ничего не делает.
 * С других страниц — переход на главную к якорю.
 */
export default function ProgrammeLink({ className, children }: ProgrammeLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  return isHome ? (
    <a href="#programme" className={className}>
      {children}
    </a>
  ) : (
    <Link href="/#programme" className={className}>
      {children}
    </Link>
  );
}
