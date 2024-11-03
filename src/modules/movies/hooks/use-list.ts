import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { searchValues } from "@/helpers/constants";

const useList = (query: string) => {
  const initialData = { items: [].map(item => Mappers.Single(item)) };

  const { data = initialData, ...args } = useQuery<Types.IQuery.List, string>({
    queryKey: ["movies", "search_list", query],
    queryFn: async () => {
      const items: Types.Entity.Data[] = [];

      for (const type of searchValues) {
        const { data } = await Api.List(query, type);
        const mappedItems = get(data, "results").map(item => Mappers.Single(item, type));
        items.push(...mappedItems);
      }

      return { items };
    },
    enabled: !!query,
  });

  return { ...data, ...args };
};

export default useList;
