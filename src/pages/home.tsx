import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { useList as useMoviesList, useTopList } from "@/modules/movies/hooks";

import Image from "@/components/Image";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [query, setQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items: movies } = useMoviesList(query);
  const { items: top_rated } = useTopList();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(searchInputRef.current?.value as string);
  };

  return (
    <main>
      <div className="container">
        <div className="pt-10 mb-2">
          <h1 className="text-center text-5xl font-bold mb-10">Poster Searcher</h1>
          <form className="flex mx-auto max-w-lg gap-2" onSubmit={onSubmit}>
            <Input ref={searchInputRef} placeholder="search" autoFocus />

            <Button type="submit">
              <Search className="text-white" />
            </Button>
          </form>
        </div>

        {!movies.length && (
          <p className="text-center text-xl text-black/60">
            Search for any movie poster you want...
          </p>
        )}

        <div className="flex justify-center items-center flex-wrap pt-5 gap-4 rounded-md">
          {movies.length ? (
            <>
              {movies.map(movie => (
                <Card
                  className="max-w-full xs:max-w-[200px] md:max-w-[220px] p-2 w-full relative"
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
                  className="max-w-full xs:max-w-[200px] md:max-w-[220px] p-2 w-full relative"
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
