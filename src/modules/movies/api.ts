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

export const Single = (id: string): AxiosPromise<Types.IApi.Single> => {
  return http.get(`/movie/${id}`);
};

export const ImagesList = (id: string): AxiosPromise<Types.IApi.ImagesList> => {
  return http.get(`/movie/${id}/images`);
};
