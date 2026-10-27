import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { MediaType } from "@/helpers/interfaces";

const useTrending = (type: MediaType | "all" = "all", window: "day" | "week" = "week") => {
  const { data = [], ...args } = useQuery<Types.Entity.Media[], string>({
    queryKey: ["movies", "trending", type, window],
    queryFn: async () => {
      const { data } = await Api.Trending(type, window);
      return Mappers.Paged(data, item => Mappers.Media(item, type === "all" ? undefined : type))
        .items.filter(item => item.type === "movie" || item.type === "tv");
    },
  });

  return { items: data, ...args };
};

export default useTrending;
