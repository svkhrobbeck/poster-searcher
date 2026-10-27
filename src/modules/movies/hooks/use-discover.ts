import uniqBy from "lodash/uniqBy";
import { useInfiniteQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { MediaType } from "@/helpers/interfaces";
import { buildDiscoverParams, DiscoverFilters } from "../helpers";

const useDiscover = (type: MediaType, filters: DiscoverFilters) => {
  const { data, ...args } = useInfiniteQuery<Types.Entity.Paged<Types.Entity.Media>, string>({
    queryKey: ["movies", "discover", type, filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await Api.Discover(type, buildDiscoverParams(type, filters), pageParam as number);
      return Mappers.Paged(data, item => Mappers.Media(item, type));
    },
    initialPageParam: 1,
    getNextPageParam: last => (last.page < last.totalPages ? last.page + 1 : undefined),
  });

  // TMDB pages can overlap when popularity shifts between requests
  const items = uniqBy(data?.pages.flatMap(page => page.items) ?? [], item => `${item.type}-${item.id}`);

  return { items, ...args };
};

export default useDiscover;
