import { get } from "radash";

import * as Types from "./types";
import { BASE_BG_URL, BASE_IMG_URL } from "@/helpers/constants";

export const Single = (item?: any): Types.Entity.Data => {
  const poster_path = get(item, "poster_path") ? BASE_IMG_URL + get(item, "poster_path") : "";
  const backdrop_path = get(item, "backdrop_path") ? BASE_BG_URL + get(item, "backdrop_path") : "";

  return {
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
    original_language: get(item, "original_language") || "",
  };
};
