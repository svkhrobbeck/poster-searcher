import { Helmet } from "react-helmet";
import { SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { searchTypes } from "@/helpers/constants";
import { SearchType } from "@/helpers/interfaces";
import { useSearch } from "@/modules/movies/hooks";
import { CardGrid, Chip, GridSkeleton, LoadMore, MediaCard, PersonCard } from "@/components/shared";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q")?.trim() || "";
  const type = (searchTypes.find(t => t.value === params.get("type"))?.value ?? "multi") as SearchType;

  const { items, totalResults, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isPlaceholderData } =
    useSearch(type, query);

  const setType = (value: SearchType) => {
    const next = new URLSearchParams(params);
    if (value === "multi") next.delete("type");
    else next.set("type", value);
    setParams(next, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>{query ? `${query} — Search` : "Search"}</title>
      </Helmet>

      <main className="container py-5 sm:py-8">
        <div className="-mx-[15px] mb-5 flex gap-2 overflow-x-auto px-[15px] scrollbar-hide">
          {searchTypes.map(t => (
            <Chip key={t.value} active={t.value === type} onClick={() => setType(t.value)}>
              {t.title}
            </Chip>
          ))}
        </div>

        {!query ? (
          <p className="py-20 text-center text-slate-400">
            Start typing to find movies, TV shows and people
          </p>
        ) : isLoading ? (
          <GridSkeleton />
        ) : !items.length ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center text-slate-400">
            <SearchX className="size-10" />
            Nothing found for “{query}”
          </div>
        ) : (
          <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <p className="mb-4 text-sm text-slate-400">
              {totalResults.toLocaleString()} results for “{query}”
            </p>
            <CardGrid>
              {items.map(item =>
                item.type === "person" ? (
                  <PersonCard key={`person-${item.id}`} item={item} />
                ) : (
                  <MediaCard key={`${item.type}-${item.id}`} item={item} />
                )
              )}
            </CardGrid>
            <LoadMore
              hasNextPage={!!hasNextPage}
              isFetching={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </div>
        )}
      </main>
    </>
  );
};

export default Search;
