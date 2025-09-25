import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Item = { label: string; url: string; current: boolean };

export default function LangMenu({ items, currentLabel }: { items: Item[]; currentLabel: string }) {
  // Navigate while keeping ?query and #hash
  const go = React.useCallback((href: string) => {
    const target = new URL(href, document.baseURI);
    target.search = location.search;
    target.hash = location.hash;
    location.assign(target.toString());
  }, []);

  const active = React.useMemo(
    () => items.find((it) => it.current)?.url ?? items[0]?.url ?? "",
    [items]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Change language, current ${currentLabel}`}
          className="rounded-full"
        >
          <Languages className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} aria-label="Select language">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={active}
          onValueChange={(value) => {
            if (value && value !== active) {
              go(value);
            }
          }}
        >
          {items.map((it) => (
            <DropdownMenuRadioItem
              key={it.label}
              value={it.url}
              aria-label={`Switch to ${it.label}`}
            >
              {it.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
