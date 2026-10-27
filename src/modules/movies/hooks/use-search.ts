import uniqBy from "lodash/uniqBy";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { SearchType } from "@/helpers/interfaces";

const useSearch = (type: SearchType, query: string) => {
  const { data, ...args } = useInfiniteQuery<
    Types.Entity.Paged<Types.Entity.SearchResult>,
    string
  >({
    queryKey: ["movies", "search", type, query],
    queryFn: async ({ pageParam }) => {
      const { data } = await Api.Search(type, query, pageParam as number);
      return Mappers.Paged(data, item => Mappers.SearchResult(item, type));
    },
    initialPageParam: 1,
    getNextPageParam: last => (last.page < last.totalPages ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    enabled: !!query,
  });

  const pages = data?.pages ?? [];
  const items = uniqBy(pages.flatMap(page => page.items), item => `${item.type}-${item.id}`);
  const totalResults = pages[0]?.totalResults ?? 0;

  return { items, totalResults, ...args };
};

export default useSearch;
