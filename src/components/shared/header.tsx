import debounce from "lodash/debounce";
import { Clapperboard, Compass, Heart, Search } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useSaved } from "@/hooks/use-library";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative inline-flex h-10 items-center gap-2 rounded-full px-2.5 text-sm font-medium transition-colors hover:bg-slate-800 sm:px-3",
    isActive ? "text-slate-50" : "text-slate-400"
  );

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const { items: saved } = useSaved();
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearchPage = pathname === "/search";

  const [value, setValue] = useState(isSearchPage ? params.get("q") || "" : "");

  // "/" focuses the search field from anywhere (like GitHub / YouTube)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // reset the field when leaving the search page, restore it when coming back
  useEffect(() => {
    setValue(isSearchPage ? new URLSearchParams(window.location.search).get("q") || "" : "");
  }, [isSearchPage]);

  const goToSearch = useMemo(
    () =>
      debounce((query: string) => {
        const current = new URLSearchParams(window.location.search);
        const next = new URLSearchParams({ q: query.trim() });
        if (window.location.pathname === "/search" && current.get("type")) {
          next.set("type", current.get("type")!);
        }
        navigate(`/search?${next}`, { replace: window.location.pathname === "/search" });
      }, 350),
    [navigate]
  );

  useEffect(() => () => goToSearch.cancel(), [goToSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goToSearch(value);
    goToSearch.flush();
    (document.activeElement as HTMLElement | null)?.blur(); // hide the mobile keyboard
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="container flex h-14 items-center gap-3 sm:h-16 sm:gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold" aria-label="Home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-slate-950">
            <Clapperboard className="size-5" />
          </span>
          <span className="hidden text-lg sm:inline">Posters</span>
        </Link>

        <form onSubmit={handleSubmit} className="relative flex-1 sm:max-w-xl" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={value}
            onChange={e => {
              setValue(e.target.value);
              goToSearch(e.target.value);
            }}
            autoFocus={isSearchPage && !value}
            placeholder="Search movies, shows, people..."
            className="peer h-10 w-full rounded-full border border-slate-800 bg-slate-900 pl-9 pr-4 text-[16px] placeholder:text-slate-500 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-700 sm:pr-10 sm:text-sm"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-700 px-1.5 text-xs text-slate-500 peer-focus:!hidden peer-[:not(:placeholder-shown)]:!hidden [@media(hover:hover)]:sm:block">
            /
          </kbd>
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:ml-auto">
          <NavLink to="/discover" className={navLinkClassName} aria-label="Discover">
            <Compass className="size-5" />
            <span className="hidden md:inline">Discover</span>
          </NavLink>
          <NavLink to="/saved" className={navLinkClassName} aria-label="Saved">
            <Heart className="size-5" />
            <span className="hidden md:inline">Saved</span>
            {!!saved.length && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white md:static">
                {saved.length}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
