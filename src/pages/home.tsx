import cx from "classnames";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Card, Input } from "@/components/ui";
import { LazyImage } from "@/components/shared";
import { useList as useMoviesList, useTopList } from "@/modules/movies/hooks";

const Home = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>(params.get("q") || "");

  const { items: top_rated } = useTopList();
  const { items: movies } = useMoviesList(search);

  const advancedNavigate = (path: string, sets: string[][] = [], removes: string[] = []) => {
    const params = new URLSearchParams(location.search);
    sets.forEach(([key, value]) => params.set(key, value));
    removes.forEach(key => params.delete(key));
    navigate(path + "?" + params.toString());
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    advancedNavigate("", [["q", value]]);
  };

  const debouncedSearch = debounce(handleSearch, 300);

  return (
    <>
      <Helmet>
        <title>Posters</title>
      </Helmet>

      <main>
        <div className="container">
          <div className="pt-3 md:pt-10 mb-2">
            <h1 className="text-center text-4xl md:text-5xl font-semibold mb-5 md:mb-10">
              Posters
            </h1>

            <Input
              className={cx("max-w-2xl mx-auto", movies.length && "mb-16")}
              defaultValue={search}
              ref={searchInputRef}
              onChange={debouncedSearch}
              placeholder="Search..."
              autoFocus
            />
          </div>

          {!movies.length && (
            <p className="text-center text-sm md:text-md lg:text-xl text-black/60 mb-8">
              Search for any movie poster you want...
            </p>
          )}

          <div className="flex justify-center items-center flex-wrap py-5 gap-1 sm:gap-4 rounded-md">
            {movies.length ? (
              <>
                {movies.map(movie => (
                  <Card
                    className="max-w-[47%] xs:max-w-[200px] md:max-w-[220px] p-2 w-full relative"
                    key={movie.id}
                  >
                    <LazyImage
                      className="w-full aspect-[2/3]"
                      src={movie.poster_path}
                      alt={movie.title}
                    />
                    <Link className="absolute inset-0" to={`/${movie.type}/${movie.id}`} />
                  </Card>
                ))}
              </>
            ) : (
              <>
                {top_rated.map(movie => (
                  <Card
                    className="max-w-[47%] xs:max-w-[200px] md:max-w-[220px] p-2 w-full relative"
                    key={movie.id}
                  >
                    <LazyImage
                      className="w-full aspect-[2/3]"
                      src={movie.poster_path}
                      alt={movie.title}
                    />
                    <Link className="absolute inset-0" to={`/${movie.type}/${movie.id}`} />
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
