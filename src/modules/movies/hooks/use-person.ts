import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Types from "../types";
import * as Mappers from "../mappers";

const usePerson = (id: string) => {
  const { data, ...args } = useQuery<Types.Entity.PersonDetails, string>({
    queryKey: ["movies", "person", id],
    queryFn: async () => {
      const { data } = await Api.Person(id);
      return Mappers.PersonDetails(data);
    },
    enabled: !!id,
  });

  return { item: data, ...args };
};

export default usePerson;
