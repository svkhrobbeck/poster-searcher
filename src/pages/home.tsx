import { useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { useList as useMoviesList } from "@/modules/movies/hooks";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Home = () => {
  const [query, setQuery] = useState<string>("naruto");
  const { items, isFetched } = useMoviesList(query);

  const array = new Array(9).fill("");

  return (
    <main>
      <div className="container">
        <div className="py-3">
          <Input
            placeholder="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />

          <div className="flex justify-center items-center flex-wrap pt-5 gap-4 rounded-md">
            {isFetched
              ? items.map(movie => (
                  <Card className="relative" key={movie.id}>
                    <Link className="absolute inset-0" to={`/${movie.id}`} />
                    <img className="max-w-[300px]" src={movie.poster_path} alt="" />
                  </Card>
                ))
              : array.map((_, idx) => <Skeleton key={idx} width={300} height={450} />)}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;
