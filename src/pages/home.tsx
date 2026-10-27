import { Helmet } from "react-helmet";
import { Info } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

import { getYear } from "@/lib/utils";
import { useRecent } from "@/hooks/use-library";
import { buttonVariants } from "@/components/ui/button";
import { MediaRow, Rating } from "@/components/shared";
import { ANIME_GENRE_ID, ANIME_LANGUAGE, imageUrl } from "@/helpers/constants";
import { useCategory, useDiscover, useTrending } from "@/modules/movies/hooks";

const animeFilters = { sort: "popularity.desc", genre: ANIME_GENRE_ID, lang: ANIME_LANGUAGE } as const;

const Home = () => {
  const [params] = useSearchParams();

  const trending = useTrending("all", "day");
  const popularMovies = useCategory("movie", "popular");
  const popularTv = useCategory("tv", "popular");
  const anime = useDiscover("tv", animeFilters);
  const topRated = useCategory("movie", "top_rated");
  const upcoming = useCategory("movie", "upcoming");
  const recent = useRecent();

  // old links used /?q=... for search
  if (params.get("q")) return <Navigate to={`/search?q=${encodeURIComponent(params.get("q")!)}`} replace />;

  const featured = trending.items.find(item => item.backdrop_path);

  return (
    <>
      <Helmet>
        <title>Posters — movie & TV posters, backdrops and logos</title>
      </Helmet>

      <main>
        <section className="relative isolate overflow-hidden">
          {featured ? (
            <>
              <img
                src={imageUrl(featured.backdrop_path, "w1280")}
                alt=""
                className="absolute inset-0 -z-10 size-full object-cover object-top opacity-50"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/30 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 -z-10 animate-pulse bg-slate-900" />
          )}

          <div className="container flex min-h-[340px] flex-col justify-end py-8 sm:min-h-[440px] sm:py-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-300">
              Trending today
            </p>
            {featured ? (
              <>
                <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
                  {featured.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-slate-300">
                  <Rating value={featured.vote_average} />
                  <span>{getYear(featured.release_date)}</span>
                  <span>{featured.type === "tv" ? "TV Show" : "Movie"}</span>
                </div>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm text-slate-300 sm:line-clamp-3 sm:text-base">
                  {featured.overview}
                </p>
                <Link
                  to={`/${featured.type}/${featured.id}`}
                  className={buttonVariants({ className: "mt-5 w-full xs:w-fit" })}
                >
                  <Info className="mr-2 size-4" /> Posters & details
                </Link>
              </>
            ) : (
              <div className="h-24" />
            )}
          </div>
        </section>

        <MediaRow
          title="Recently viewed"
          items={recent.items}
          action={
            <button
              type="button"
              onClick={recent.clear}
              className="text-sm text-slate-400 transition-colors hover:text-slate-50"
            >
              Clear
            </button>
          }
        />
        <MediaRow title="Trending today" items={trending.items} isLoading={trending.isLoading} />
        <MediaRow
          title="Popular movies"
          items={popularMovies.items}
          isLoading={popularMovies.isLoading}
          href="/discover?type=movie"
        />
        <MediaRow
          title="Popular TV shows"
          items={popularTv.items}
          isLoading={popularTv.isLoading}
          href="/discover?type=tv"
        />
        <MediaRow
          title="Anime"
          items={anime.items}
          isLoading={anime.isLoading}
          href={`/discover?type=tv&genre=${ANIME_GENRE_ID}&lang=${ANIME_LANGUAGE}`}
        />
        <MediaRow
          title="Top rated movies"
          items={topRated.items}
          isLoading={topRated.isLoading}
          href="/discover?type=movie&sort=vote_average.desc"
        />
        <MediaRow title="Upcoming movies" items={upcoming.items} isLoading={upcoming.isLoading} />
      </main>
    </>
  );
};

export default Home;
