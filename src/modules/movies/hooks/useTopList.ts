import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";

const useList = () => {
  const initialData = { items: [].map(item => Mappers.Single(item)), meta: Mappers.Meta() };

  const { data = initialData, ...args } = useQuery<Types.IQuery.List, string>({
    queryKey: ["movies", "search_list"],
    queryFn: async () => {
      const { data } = await Api.TopList();
      const items = get(data, "results").map(item => Mappers.Single(item));
      const meta = Mappers.Meta(data);

      return { items, meta };
    },
  });

  return { ...data, ...args };
};

export default useList;
