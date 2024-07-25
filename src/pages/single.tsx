import { useSingle } from "@/modules/movies/hooks";
import { Link, useParams } from "react-router-dom";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Single = () => {
  const id = useParams().id || "";
  const { item } = useSingle(id);

  return (
    <main>
      <section className="flex items-center flex-col justify-start">
        <p>Background Image</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link to={item.backdrop_path}>
                <img className="max-w-[400px]" src={item.backdrop_path} alt="background" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Background Image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <br />

        <p>Poster Image</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link to={item.poster_path}>
                <img className="max-w-[300px]" src={item.poster_path} alt="poster" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Poster Image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
    </main>
  );
};
export default Single;
