import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { MediaType, SortType } from "@/helpers/interfaces";
import { useDiscover, useGenres } from "@/modules/movies/hooks";
import { ANIME_GENRE_ID, ANIME_LANGUAGE, sortOptions } from "@/helpers/constants";
import { CardGrid, Chip, GridSkeleton, LoadMore, MediaCard } from "@/components/shared";

const Discover = () => {
  const [params, setParams] = useSearchParams();

  const type: MediaType = params.get("type") === "tv" ? "tv" : "movie";
  const sort = (sortOptions.find(o => o.value === params.get("sort"))?.value ??
    "popularity.desc") as SortType;
  const genre = params.get("genre") || "";
  const lang = params.get("lang") || "";
  const isAnime = genre === ANIME_GENRE_ID && lang === ANIME_LANGUAGE;

  const filters = useMemo(() => ({ sort, genre, lang }), [sort, genre, lang]);
  const { items: genres } = useGenres(type);
  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useDiscover(
    type,
    filters
  );

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    setParams(next, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Discover {type === "tv" ? "TV shows" : "movies"}</title>
      </Helmet>

      <main className="container py-5 sm:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">Discover</h1>

          <div className="flex w-full gap-2 xs:w-auto">
            <div className="flex flex-1 rounded-full bg-slate-900 p-1 ring-1 ring-slate-800 xs:flex-none">
              {(["movie", "tv"] as const).map(value => (
                <button
                  key={value}
                  type="button"
                  // genre ids differ between movies and TV, so reset non-anime genres
                  onClick={() => update({ type: value, genre: isAnime ? genre : "", lang: isAnime ? lang : "" })}
                  className={
                    "flex-1 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                    (type === value ? "bg-slate-50 text-slate-900" : "text-slate-400 hover:text-slate-50")
                  }
                >
                  {value === "movie" ? "Movies" : "TV Shows"}
                </button>
              ))}
            </div>

            <label className="relative flex-1 xs:flex-none">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={e => update({ sort: e.target.value === "popularity.desc" ? "" : e.target.value })}
                className="h-full w-full appearance-none rounded-full border border-slate-800 bg-slate-900 py-1.5 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="-mx-[15px] mb-6 flex gap-2 overflow-x-auto px-[15px] pb-1 scrollbar-hide">
          <Chip active={!genre && !lang} onClick={() => update({ genre: "", lang: "" })}>
            All
          </Chip>
          <Chip
            active={isAnime}
            onClick={() =>
              update(isAnime ? { genre: "", lang: "" } : { genre: ANIME_GENRE_ID, lang: ANIME_LANGUAGE })
            }
          >
            Anime
          </Chip>
          {genres.map(g => (
            <Chip
              key={g.id}
              active={!isAnime && genre === String(g.id)}
              onClick={() => update({ genre: String(g.id), lang: "" })}
            >
              {g.name}
            </Chip>
          ))}
        </div>

        {isLoading ? (
          <GridSkeleton count={18} />
        ) : !items.length ? (
          <p className="py-20 text-center text-slate-400">Nothing found</p>
        ) : (
          <>
            <CardGrid>
              {items.map(item => (
                <MediaCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </CardGrid>
            <LoadMore
              hasNextPage={!!hasNextPage}
              isFetching={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Discover;
