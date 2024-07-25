import { AxiosPromise } from "axios";

import { http } from "@/services";
import * as Types from "./types";

export const List = (query: string): AxiosPromise<Types.IApi.List> => {
  return http.get("/search/movie", { params: { query } });
};

export const Single = (id: string): AxiosPromise<Types.IApi.Single> => {
  return http.get(`/movie/${id}`);
};
