import cx from "classnames";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageOff,
  Link2,
} from "lucide-react";

import Chip from "./chip";
import Image from "./image";
import { downloadImage } from "@/lib/download";
import { Selectable, Selection } from "@/hooks/use-selection";
import { ImageSize, imageUrl } from "@/helpers/constants";
import { cn, languageName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export interface GalleryItem extends Selectable {
  path: string;
  /** Download file name without extension */
  name: string;
  width?: number;
  height?: number;
  lang?: string | null;
  caption?: string;
}

export type GalleryKind = "poster" | "backdrop" | "logo" | "profile";

const kindConfig: Record<
  GalleryKind,
  { grid: string; aspect: string; thumb: ImageSize; preview: ImageSize }
> = {
  poster: {
    grid: "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
    aspect: "aspect-[2/3]",
    thumb: "w342",
    preview: "w780",
  },
  profile: {
    grid: "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
    aspect: "aspect-[2/3]",
    thumb: "w185",
    preview: "original",
  },
  backdrop: {
    grid: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    aspect: "aspect-video",
    thumb: "w780",
    preview: "w1280",
  },
  logo: {
    grid: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    aspect: "aspect-video",
    thumb: "w500",
    preview: "original",
  },
};

// checkerboard so white and dark transparent logos are both visible
const logoBackground =
  "bg-[repeating-conic-gradient(#1e293b_0_25%,#0f172a_0_50%)] bg-[length:16px_16px]";

const ALL = "__all__";
const NO_TEXT = "__none__";

const langKey = (lang?: string | null) => (lang ? lang : NO_TEXT);

interface GalleryProps {
  items: GalleryItem[];
  kind: GalleryKind;
  selection: Selection<GalleryItem>;
  emptyText?: string;
}

const Gallery = ({ items, kind, selection, emptyText = "Nothing found" }: GalleryProps) => {
  const config = kindConfig[kind];
  const [lang, setLang] = useState(ALL);
  const [sort, setSort] = useState<"popular" | "quality">("popular");
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const lastToggledIdx = useRef<number | null>(null);

  // indexes refer to the visible list, so reset the shift-range anchor when it changes
  useEffect(() => {
    lastToggledIdx.current = null;
  }, [lang, sort]);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach(item => counts.set(langKey(item.lang), (counts.get(langKey(item.lang)) || 0) + 1));
    // most common first, "No text" always right after "All"
    return [...counts.entries()].sort(([a, ca], [b, cb]) =>
      a === NO_TEXT ? -1 : b === NO_TEXT ? 1 : cb - ca
    );
  }, [items]);

  const filtered = useMemo(() => {
    const list = lang === ALL ? items : items.filter(item => langKey(item.lang) === lang);
    // TMDB already returns images ordered by votes, so "popular" keeps the original order
    return sort === "quality"
      ? [...list].sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0))
      : list;
  }, [items, lang, sort]);

  const allSelected = filtered.length > 0 && filtered.every(item => selection.isSelected(item.id));
  const selecting = selection.count > 0;
  const hasSizes = items.some(item => item.width);

  // Shift+click selects everything between the last clicked image and this one
  const handleToggle = (item: GalleryItem, idx: number, shiftKey: boolean) => {
    const last = lastToggledIdx.current;
    if (shiftKey && last !== null && last !== idx) {
      const [from, to] = last < idx ? [last, idx] : [idx, last];
      selection.setMany(filtered.slice(from, to + 1), true);
    } else {
      selection.toggle(item);
    }
    lastToggledIdx.current = idx;
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
        <ImageOff className="size-8" />
        {emptyText}
      </div>
    );
  }

  const handleCardClick = (item: GalleryItem, idx: number, shiftKey: boolean) => {
    if (selecting || shiftKey) handleToggle(item, idx, shiftKey);
    else setPreviewIdx(idx);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {languages.length > 1 ? (
          <div className="-mx-[15px] flex min-w-0 gap-2 overflow-x-auto px-[15px] scrollbar-hide sm:mx-0 sm:px-0">
            <Chip active={lang === ALL} onClick={() => setLang(ALL)}>
              All <span className="opacity-60">{items.length}</span>
            </Chip>
            {languages.map(([code, count]) => (
              <Chip key={code} active={lang === code} onClick={() => setLang(code)}>
                {languageName(code === NO_TEXT ? null : code)}{" "}
                <span className="opacity-60">{count}</span>
              </Chip>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">{items.length} images</p>
        )}

        <div className="flex shrink-0 gap-2">
          {hasSizes && (
            <label className="relative">
              <span className="sr-only">Sort images</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as typeof sort)}
                className="h-9 appearance-none rounded border-0 bg-slate-800 py-1 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option value="popular">Most popular</option>
                <option value="quality">Highest quality</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>
          )}
          <Button
            variant="secondary"
            className="h-9"
            onClick={() => selection.setMany(filtered, !allSelected)}
          >
            <Check className="mr-1.5 size-4" />
            {allSelected ? "Deselect all" : `Select all (${filtered.length})`}
          </Button>
        </div>
      </div>

      <div className={cx("grid gap-2 sm:gap-3", config.grid)}>
        {filtered.map((item, idx) => {
          const selected = selection.isSelected(item.id);

          return (
            <div key={item.id} className="group relative">
              <button
                type="button"
                onClick={e => handleCardClick(item, idx, e.shiftKey)}
                className={cx(
                  "block w-full overflow-hidden rounded-lg outline-none ring-offset-2 ring-offset-slate-950 transition focus-visible:ring-2 focus-visible:ring-slate-300",
                  selected ? "ring-2 ring-sky-400" : "ring-1 ring-slate-800 hover:ring-slate-500"
                )}
                aria-label={selecting ? "Toggle selection" : "Open preview"}
              >
                <Image
                  className={cn(config.aspect, "w-full", kind === "logo" && logoBackground)}
                  object={kind === "logo" ? "contain" : "cover"}
                  src={imageUrl(item.path, config.thumb)}
                  alt={item.name}
                />
                {selected && <span className="absolute inset-0 rounded-lg bg-sky-400/15" />}
              </button>

              {/* checkbox: always visible on touch screens, on hover for mouse */}
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label="Select image"
                onClick={e => handleToggle(item, idx, e.shiftKey)}
                className={cx(
                  "absolute left-1.5 top-1.5 flex size-8 items-center justify-center rounded-md transition-opacity",
                  selected || selecting
                    ? "opacity-100"
                    : "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                )}
              >
                <span
                  className={cx(
                    "flex size-6 items-center justify-center rounded-md border-2 shadow transition-colors",
                    selected
                      ? "border-sky-400 bg-sky-400 text-slate-950"
                      : "border-white/80 bg-slate-950/50 text-transparent backdrop-blur"
                  )}
                >
                  <Check className="size-4" strokeWidth={3} />
                </span>
              </button>

              {!selecting && (
                <button
                  type="button"
                  aria-label="Download"
                  onClick={() => downloadImage(item)}
                  className="absolute bottom-1.5 right-1.5 flex size-9 items-center justify-center rounded-full bg-slate-950/75 text-slate-50 shadow backdrop-blur transition hover:bg-slate-50 hover:text-slate-950 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                >
                  <Download className="size-4" />
                </button>
              )}

              {!!item.width && (
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-slate-950/75 px-1.5 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur">
                  {item.width}×{item.height}
                </span>
              )}
              {item.caption && <p className="mt-1.5 line-clamp-1 text-sm">{item.caption}</p>}
            </div>
          );
        })}
      </div>

      <Preview
        items={filtered}
        index={previewIdx}
        kind={kind}
        selection={selection}
        onIndexChange={setPreviewIdx}
      />
    </div>
  );
};

const copyImageLink = async (path: string) => {
  try {
    await navigator.clipboard.writeText(imageUrl(path, "original"));
    toast.success("Rasm linki nusxalandi", { duration: 2000 });
  } catch {
    toast.error("Linkni nusxalab bo'lmadi");
  }
};

interface PreviewProps {
  items: GalleryItem[];
  index: number | null;
  kind: GalleryKind;
  selection: Selection<GalleryItem>;
  onIndexChange: (index: number | null) => void;
}

const Preview = ({ items, index, kind, selection, onIndexChange }: PreviewProps) => {
  const item = index !== null ? items[index] : undefined;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1) onIndexChange(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onIndexChange]);

  return (
    <Dialog open={!!item} onOpenChange={open => !open && onIndexChange(null)}>
      <DialogContent className="max-h-[100dvh] max-w-5xl gap-3 overflow-y-auto border-slate-800 bg-slate-950 p-3 sm:p-4">
        {item && (
          <>
            <DialogTitle className="pr-8 text-base">{item.name}</DialogTitle>
            <DialogDescription className="sr-only">Image preview</DialogDescription>
            <div className="relative">
              <Image
                className={cn(
                  "w-full rounded-lg",
                  kind === "backdrop" || kind === "logo" ? "aspect-video" : "mx-auto aspect-[2/3] max-h-[70dvh] w-auto",
                  kind === "logo" && logoBackground
                )}
                object="contain"
                src={imageUrl(item.path, kindConfig[kind].preview)}
                alt={item.name}
              />
              {hasPrev && (
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => onIndexChange(index! - 1)}
                  className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur hover:bg-slate-800"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {hasNext && (
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => onIndexChange(index! + 1)}
                  className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur hover:bg-slate-800"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                {[
                  item.width ? `${item.width}×${item.height}` : "",
                  item.lang !== undefined ? languageName(item.lang) : "",
                  `${index! + 1} / ${items.length}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="flex w-full gap-2 xs:w-auto">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 shrink-0"
                  aria-label="Copy image link"
                  title="Copy image link"
                  onClick={() => copyImageLink(item.path)}
                >
                  <Link2 className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 xs:flex-none"
                  onClick={() => selection.toggle(item)}
                >
                  <Check className="mr-1.5 size-4" />
                  {selection.isSelected(item.id) ? "Selected" : "Select"}
                </Button>
                <Button className="flex-1 xs:flex-none" onClick={() => downloadImage(item)}>
                  <Download className="mr-1.5 size-4" /> Download
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Gallery;
