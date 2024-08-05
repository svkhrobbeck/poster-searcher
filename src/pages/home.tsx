import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { useList as useMoviesList, useTopList } from "@/modules/movies/hooks";

import Image from "@/components/Image";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState<string>(params.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items: movies } = useMoviesList(search);
  const { items: top_rated } = useTopList();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchInputRef.current?.value as string;

    setSearch(value);
    navigate("?" + new URLSearchParams({ q: value }).toString());
  };

  return (
    <main>
      <div className="container">
        <div className="pt-3 md:pt-10 mb-2">
          <h1 className="text-center text-4xl md:text-5xl font-semibold mb-5 md:mb-10">
            Poster Searcher
          </h1>
          <form className="flex mx-auto max-w-lg gap-2" onSubmit={onSubmit}>
            <Input defaultValue={search} ref={searchInputRef} placeholder="search" autoFocus />

            <Button type="submit">
              <Search className="text-white" />
            </Button>
          </form>
        </div>

        {!movies.length && (
          <p className="text-center text-sm md:text-md lg:text-xl text-black/60">
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
                  <Image
                    className="w-full aspect-[2/3]"
                    src={movie.poster_path}
                    alt={movie.title}
                  />
                  <Link className="absolute inset-0" to={`/${movie.id}`} />
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
                  <Image
                    className="w-full aspect-[2/3]"
                    src={movie.poster_path}
                    alt={movie.title}
                  />
                  <Link className="absolute inset-0" to={`/${movie.id}`} />
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
