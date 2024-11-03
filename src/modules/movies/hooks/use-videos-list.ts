import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { SearchUnionType } from "@/helpers/interfaces";

const useVideosList = (id: string, type: SearchUnionType, enabled: boolean) => {
  const initialData = { items: [].map(item => Mappers.Video(item)) };

  const { data = initialData, ...args } = useQuery<Types.IQuery.VideosList, string>({
    queryKey: ["movies", "videos", id, type],
    queryFn: async () => {
      const { data } = await Api.VideosList(id, type);
      const items = get(data, "results").map(item => Mappers.Video(item));
      return { items };
    },
    enabled,
  });

  return { ...data, ...args };
};

export default useVideosList;
