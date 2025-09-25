import * as React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LangMenu from "@/components/LangMenu";

type LangItem = { label: string; url: string; current: boolean };
type NavItem = { label: string; url: string; current?: boolean };

export default function MobileMenu({
  langItems,
  currentLabel,
  nav,
}: {
  langItems: LangItem[];
  currentLabel: string;
  nav: NavItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const listenerOptions: AddEventListenerOptions = { capture: true };
    document.addEventListener("click", onDocClick, listenerOptions);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick, listenerOptions);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative flex items-center gap-2 md:hidden">
      <LangMenu items={langItems} currentLabel={currentLabel} />
      <ThemeToggle />

      <button
        type="button"
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 hover:text-amber-600 focus:outline-none"
      >
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-border bg-background absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border p-1 shadow-lg"
        >
          {nav.map((n) => (
            <a
              key={n.url}
              href={n.url}
              className={`hover:bg-accent hover:text-accent block rounded-md px-3 py-2 ${n.current ? "text-primary font-semibold" : ""}`}
              aria-current={n.current ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
