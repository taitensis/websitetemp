export type NavigationLink = {
  /**
   * Path relative to the site base URL, e.g. "/" or "recipes".
   * Leading slashes are optional.
   */
  path: string;
  /**
   * Text label rendered for the navigation item.
   */
  label: string;
};

const RAW_NAVIGATION_LINKS: NavigationLink[] = [
  { path: "/", label: "Home" },
  { path: "recipes", label: "Recipes" },
  { path: "about", label: "About" },
];

function normalizeBase(base: string) {
  return base.endsWith("/") ? base : `${base}/`;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path.slice(1) : path;
}

/**
 * Resolve a relative navigation path to an absolute href taking Astro's base URL into account.
 */
export function resolveNavHref(path: string) {
  const base = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const normalizedBase = normalizeBase(base);
  const normalizedPath = normalizePath(path);
  return normalizedPath ? `${normalizedBase}${normalizedPath}` : normalizedBase;
}

/**
 * Navigation links used across the site.
 * Exported as a function to keep the structure extensible (e.g. sorting or filtering later).
 */
export function getNavigationLinks(): NavigationLink[] {
  return RAW_NAVIGATION_LINKS.slice();
}
