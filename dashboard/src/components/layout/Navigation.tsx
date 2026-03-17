"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTER_ORDER, CHAPTER_TITLES } from "@/lib/constants";

interface NavigationProps {
  onNavigate?: () => void;
}

/**
 * Barra de navegação entre capítulos.
 * Desktop: links horizontais. Mobile: stack vertical (usado no menu hamburger).
 */
const Navigation = ({ onNavigate }: NavigationProps) => {
  const pathname = usePathname();

  return (
    <nav aria-label="Capítulos">
      <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
        {CHAPTER_ORDER.map((slug) => {
          const href = `/${slug}`;
          const isActive = pathname === href;
          return (
            <li key={slug}>
              <Link
                href={href}
                onClick={onNavigate}
                className={[
                  "block px-3 py-2 text-sm font-sans font-medium transition-colors",
                  "hover:text-accent",
                  isActive
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {CHAPTER_TITLES[slug]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
