import cx from "classnames";
import { Link } from "react-router-dom";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import MediaCard from "./media-card";
import { CardSkeleton } from "./card-grid";
import * as Types from "@/modules/movies/types";

interface MediaRowProps {
  title: string;
  items: Types.Entity.Media[];
  isLoading?: boolean;
  href?: string;
  /** Extra control shown next to the title, e.g. a "Clear" button */
  action?: ReactNode;
}

const itemClassName = "w-[38%] shrink-0 snap-start xs:w-36 sm:w-40 md:w-44";

const arrowClassName =
  "absolute top-[calc(50%-2.5rem)] z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-50 shadow-lg backdrop-blur transition hover:bg-slate-800 [@media(hover:hover)]:flex";

const MediaRow = ({ title, items, isLoading, href, action }: MediaRowProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    setEdges({
      start: node.scrollLeft <= 4,
      end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, items.length, isLoading]);

  const scrollBy = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    node?.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!isLoading && !items.length) return null;

  return (
    <section className="py-4">
      <div className="container">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {action}
          {href && (
            <Link
              to={href}
              className="inline-flex items-center text-sm text-slate-400 transition-colors hover:text-slate-50"
            >
              See all <ChevronRight className="size-4" />
            </Link>
          )}
        </div>

        <div className="group/row relative">
          {/* mouse users get arrows instead of a horizontal scrollbar */}
          {!edges.start && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className={cx(arrowClassName, "-left-3")}
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {!edges.end && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className={cx(arrowClassName, "-right-3")}
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          {/* edge-to-edge horizontal scroller with snap on mobile */}
          <div
            ref={scrollerRef}
            onScroll={updateEdges}
            className="-mx-[15px] flex snap-x snap-mandatory scroll-px-[15px] gap-3 overflow-x-auto px-[15px] pb-2 scrollbar-hide"
          >
            {isLoading
              ? Array.from({ length: 8 }, (_, idx) => (
                  <div key={idx} className={itemClassName}>
                    <CardSkeleton />
                  </div>
                ))
              : items.map(item => (
                  <MediaCard key={`${item.type}-${item.id}`} item={item} className={itemClassName} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaRow;
