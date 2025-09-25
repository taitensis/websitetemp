import * as React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import type { NavigationLink } from "@/lib/navigation";
import { getNavigationLinks, resolveNavHref } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  links?: NavigationLink[];
};

export default function MobileMenu({ links }: MobileMenuProps) {
  const items = React.useMemo(() => links ?? getNavigationLinks(), [links]);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", closeOnDesktop);
    return () => mediaQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-2 md:hidden relative">
      {/* Theme toggle still works as a child */}
      <ThemeToggle />

      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-amber-600",
          "focus:outline-none focus:ring-2 focus:ring-amber-600"
        )}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mobile-menu">
        {/* Hamburger / X icon swap */}
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-white shadow-lg dark:bg-slate-900">
          {items.map((item) => (
            <a
              key={item.path}
              href={resolveNavHref(item.path)}
              className="block px-4 py-2 hover:text-amber-600"
              onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
