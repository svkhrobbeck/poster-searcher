import { useQuery } from "@tanstack/react-query";
import get from "lodash/get";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { SearchUnionType } from "@/helpers/interfaces";

const useImagesList = (id: string, type: SearchUnionType) => {
  const initialData = {
    item: { backdrops: [], posters: [], logos: [] },
  };

  const { data = initialData, ...args } = useQuery<Types.IQuery.ImagesList, string>({
    queryKey: ["movies", "images_list"],
    queryFn: async () => {
      const { data } = await Api.ImagesList(id, type);

      const logos = get(data, "logos").map(logo => Mappers.Image(logo));
      const posters = get(data, "posters").map(poster => Mappers.Image(poster));
      const backdrops = get(data, "backdrops").map(backdrop => Mappers.Image(backdrop));

      return { item: { posters, backdrops, logos } };
    },
  });

  return { ...data, ...args };
};
export default useImagesList;
