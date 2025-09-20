import * as React from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 md:hidden relative">
      {/* Theme toggle still works as a child */}
      <ThemeToggle />

      {/* Hamburger button */}
      <button
        type="button"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600">
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
          className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-white shadow-lg dark:bg-slate-900">
          <a
            href={import.meta.env.BASE_URL}
            className="block px-4 py-2 hover:text-amber-600"
            onClick={() => setOpen(false)}>
            Home
          </a>
          <a
            href={`${import.meta.env.BASE_URL}recipes`}
            className="block px-4 py-2 hover:text-amber-600"
            onClick={() => setOpen(false)}>
            Recipes
          </a>
          <a
            href={`${import.meta.env.BASE_URL}about`}
            className="block px-4 py-2 hover:text-amber-600"
            onClick={() => setOpen(false)}>
            About
          </a>
        </nav>
      )}
    </div>
  );
}
