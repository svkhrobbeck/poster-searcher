import { AxiosPromise } from "axios";

import { http } from "@/services";
import { MediaType, SearchType } from "@/helpers/interfaces";

type Params = Record<string, string | number | boolean>;

export const Search = (type: SearchType, query: string, page = 1): AxiosPromise<any> => {
  return http.get(`/search/${type}`, { params: { query, page, include_adult: false } });
};

export const Trending = (
  type: MediaType | "all",
  window: "day" | "week" = "week",
  page = 1
): AxiosPromise<any> => {
  return http.get(`/trending/${type}/${window}`, { params: { page } });
};

export const Category = (type: MediaType, category: string, page = 1): AxiosPromise<any> => {
  return http.get(`/${type}/${category}`, { params: { page } });
};

export const Discover = (type: MediaType, params: Params, page = 1): AxiosPromise<any> => {
  return http.get(`/discover/${type}`, { params: { ...params, page } });
};

export const Genres = (type: MediaType): AxiosPromise<any> => {
  return http.get(`/genre/${type}/list`);
};

// One request instead of four: details + images + videos + credits + recommendations
export const Details = (type: MediaType, id: string): AxiosPromise<any> => {
  return http.get(`/${type}/${id}`, {
    params: { append_to_response: "images,videos,credits,recommendations" },
  });
};

export const Person = (id: string): AxiosPromise<any> => {
  return http.get(`/person/${id}`, {
    params: { append_to_response: "images,combined_credits" },
  });
};

export const Collection = (id: number): AxiosPromise<any> => {
  return http.get(`/collection/${id}`);
};
