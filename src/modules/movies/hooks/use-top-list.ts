import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { searchValues } from "@/helpers/constants";

const useTopList = () => {
  const initialData = { items: [].map(item => Mappers.Single(item)) };

  const { data = initialData, ...args } = useQuery<Types.IQuery.List, string>({
    queryKey: ["movies", "top_list"],
    queryFn: async () => {
      const items: Types.Entity.Data[] = [];

      for (const type of searchValues) {
        const { data } = await Api.TopList(type);
        const mappedItems = get(data, "results").map(item => Mappers.Single(item, type));
        items.push(...mappedItems);
      }

      return { items };
    },
  });

  return { ...data, ...args };
};

export default useTopList;
