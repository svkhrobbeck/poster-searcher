import get from "lodash/get";
import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";

const useCollection = (id?: number) => {
  const { data = [], ...args } = useQuery<Types.Entity.Media[], string>({
    queryKey: ["movies", "collection", id],
    queryFn: async () => {
      const { data } = await Api.Collection(id!);
      return ((get(data, "parts") || []) as unknown[])
        .map(part => Mappers.Media(part, "movie"))
        .sort((a, b) => (a.release_date || "9999").localeCompare(b.release_date || "9999"));
    },
    enabled: !!id,
  });

  return { items: data, ...args };
};

export default useCollection;
