import get from "lodash/get";
import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { MediaType } from "@/helpers/interfaces";

const useGenres = (type: MediaType) => {
  const { data = [], ...args } = useQuery<Types.Entity.Genre[], string>({
    queryKey: ["movies", "genres", type],
    queryFn: async () => {
      const { data } = await Api.Genres(type);
      return (get(data, "genres") || []).map(Mappers.Genre);
    },
    staleTime: Infinity,
  });

  return { items: data, ...args };
};

export default useGenres;
