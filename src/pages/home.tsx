import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useList as useMoviesList } from "@/modules/movies/hooks";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Home = () => {
  const [query, setQuery] = useState<string>("naruto");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { items } = useMoviesList(query);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchInputRef.current && searchInputRef.current.value.length >= 2) {
      setQuery(searchInputRef.current?.value as string);
    }
  };

  return (
    <main>
      <div className="container">
        <div className="pt-10">
          <h1 className="text-center text-5xl font-bold mb-10">Poster Searcher</h1>
          <form className="flex mx-auto max-w-lg gap-2" onSubmit={onSubmit}>
            <Input ref={searchInputRef} placeholder="search" autoFocus />

            <Button type="submit">
              <Search className="text-white" />
            </Button>
          </form>
        </div>

        <div className="flex justify-center items-center flex-wrap pt-5 gap-4 rounded-md">
          {items.map(movie => (
            <Card className="max-w-[300px] p-2 w-full relative" key={movie.id}>
              <Image className="w-full aspect-[2/3]" src={movie.poster_path} alt={movie.title} />
              <Link className="absolute inset-0" to={`/${movie.id}`} />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
