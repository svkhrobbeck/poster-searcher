import get from "lodash/get";

import { BASE_BG_URL } from "@/helpers/constants";
import * as Types from "./types";

export const Single = (item?: any, type?: string): Types.Entity.Data => {
  const poster_path = get(item, "poster_path") ? BASE_BG_URL + get(item, "poster_path") : "";
  const backdrop_path = get(item, "backdrop_path") ? BASE_BG_URL + get(item, "backdrop_path") : "";

  return {
    ...(type ? { type } : {}),
    poster_path,
    backdrop_path,
    id: get(item, "id") || 0,
    adult: get(item, "adult") || false,
    title: get(item, "title") || "",
    video: get(item, "video") || false,
    overview: get(item, "overview") || "",
    genre_ids: get(item, "genre_ids") || "",
    vote_count: get(item, "vote_count") || 0,
    popularity: get(item, "popularity") || 0,
    release_date: get(item, "release_date") || "",
    vote_average: get(item, "vote_average") || 0,
    original_title: get(item, "original_title") || "",
    original_name: get(item, "original_name") || "",
    original_language: get(item, "original_language") || "",
  };
};

export const Image = (item?: any): Types.Entity.Image => {
  const file_path = get(item, "file_path") ? BASE_BG_URL + get(item, "file_path") : "";

  return {
    file_path,
    width: get(item, "width") || 0,
    height: get(item, "height") || 0,
    vote_count: get(item, "vote_count") || 0,
    aspect_ratio: get(item, "aspect_ratio") || 0,
    vote_average: get(item, "vote_average") || 0,
  };
};

export const Meta = (item?: any): Types.Entity.Meta => ({
  totalPages: get(item, "total_pages") || 1,
  page: get(item, "page") || 1,
  totalResults: get(item, "total_results") || 0,
});
