import { MediaType, SortType } from "@/helpers/interfaces";

export interface DiscoverFilters {
  sort: SortType;
  genre?: string;
  lang?: string;
}

export const buildDiscoverParams = (type: MediaType, { sort, genre, lang }: DiscoverFilters) => {
  const dateKey = type === "movie" ? "primary_release_date" : "first_air_date";
  const params: Record<string, string | number | boolean> = { include_adult: false };

  if (genre) params.with_genres = genre;
  if (lang) params.with_original_language = lang;

  if (sort === "newest") {
    params.sort_by = `${dateKey}.desc`;
    params[`${dateKey}.lte`] = new Date().toISOString().slice(0, 10);
    params["vote_count.gte"] = 10;
  } else {
    params.sort_by = sort;
    if (sort === "vote_average.desc") params["vote_count.gte"] = 300;
  }

  return params;
};
