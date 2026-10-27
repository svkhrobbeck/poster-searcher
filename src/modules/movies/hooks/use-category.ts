import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { MediaType } from "@/helpers/interfaces";

const useCategory = (type: MediaType, category: string) => {
  const { data = [], ...args } = useQuery<Types.Entity.Media[], string>({
    queryKey: ["movies", "category", type, category],
    queryFn: async () => {
      const { data } = await Api.Category(type, category);
      return Mappers.Paged(data, item => Mappers.Media(item, type)).items;
    },
  });

  return { items: data, ...args };
};

export default useCategory;
