import { Search } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useList as useMoviesList, useTopList } from "@/modules/movies/hooks";

import { searchValues } from "@/helpers/constants";
import { SearchUnionType } from "@/helpers/interfaces";

import Image from "@/components/Image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as ShadSelect from "@/components/ui/select";

const Home = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type") as SearchUnionType;

  const [search, setSearch] = useState<string>(params.get("q") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { items: movies } = useMoviesList(search, type);
  const { items: top_rated } = useTopList();

  const advancedNavigate = (sets: string[][] = [], removes: string[] = []) => {
    const params = new URLSearchParams(location.search);
    sets.forEach(([key, value]) => {
      params.set(key, value);
    });

    removes.forEach(key => {
      params.delete(key);
    });

    navigate("?" + params.toString());
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchInputRef.current?.value as string;

    if (!type) {
      alert("select search type!");
    }

    setSearch(value);
    advancedNavigate([["q", value]]);
  };

  return (
    <main>
      <div className="container">
        <div className="pt-3 md:pt-10 mb-2">
          <h1 className="text-center text-4xl md:text-5xl font-semibold mb-5 md:mb-10">Posters</h1>
          <form className="flex mx-auto max-w-lg gap-2" onSubmit={onSubmit}>
            <Input defaultValue={search} ref={searchInputRef} placeholder="search" autoFocus />
            <ShadSelect.Select
              defaultValue={type || ""}
              onValueChange={value => advancedNavigate([["type", value]])}
            >
              <ShadSelect.SelectTrigger className="w-[180px]">
                <ShadSelect.SelectValue placeholder="type" />
              </ShadSelect.SelectTrigger>
              <ShadSelect.SelectContent>
                {searchValues.map((sv, idx) => (
                  <ShadSelect.SelectItem value={sv.value} key={idx}>
                    {sv.title}
                  </ShadSelect.SelectItem>
                ))}
              </ShadSelect.SelectContent>
            </ShadSelect.Select>
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
                  <Link className="absolute inset-0" to={`/${movie.id}?type=${type}`} />
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
                  <Link className="absolute inset-0" to={`/${movie.id}?type=movie`} />
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
