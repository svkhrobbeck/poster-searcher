import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { SearchUnionType } from "@/helpers/interfaces";

const useSingle = (id: string, type: SearchUnionType) => {
  const initialData = { item: Mappers.Single() };

  const { data = initialData, ...args } = useQuery<Types.IQuery.Single, string>({
    queryKey: ["movies", "single", id, type],
    queryFn: async () => {
      const { data } = await Api.Single(id, type);
      return { item: Mappers.Single(data) };
    },
  });

  return { ...data, ...args };
};

export default useSingle;
