import { AxiosPromise } from "axios";

import { SearchUnionType } from "@/helpers/interfaces";
import { http } from "@/services";
import * as Types from "./types";

export const List = (query: string, type: SearchUnionType): AxiosPromise<Types.IApi.List> => {
  return http.get(`/search/${type}`, { params: { query } });
};

export const TopList = (): AxiosPromise<Types.IApi.List> => {
  return http.get("/movie/top_rated");
};

export const Single = (id: string, type: SearchUnionType): AxiosPromise<Types.IApi.Single> => {
  return http.get(`/${type}/${id}`);
};

export const ImagesList = (
  id: string,
  type: SearchUnionType
): AxiosPromise<Types.IApi.ImagesList> => {
  return http.get(`/${type}/${id}/images`);
};
