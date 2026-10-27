import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";
import { MediaType } from "@/helpers/interfaces";

const useDetails = (type: MediaType, id: string) => {
  const { data, ...args } = useQuery<Types.Entity.Details, string>({
    // id + type in the key so a different title never shows cached images of another one
    queryKey: ["movies", "details", type, id],
    queryFn: async () => {
      const { data } = await Api.Details(type, id);
      return Mappers.Details(data, type);
    },
    enabled: !!id,
  });

  return { item: data, ...args };
};

export default useDetails;
