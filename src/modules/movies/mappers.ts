import get from "lodash/get";

import { MediaType, SearchType } from "@/helpers/interfaces";
import * as Types from "./types";

const list = (item: any, path: string): any[] => get(item, path) || [];

export const Media = (item?: any, fallbackType?: MediaType): Types.Entity.Media => {
  const type: MediaType =
    get(item, "media_type") || fallbackType || (get(item, "first_air_date") ? "tv" : "movie");

  return {
    type,
    id: get(item, "id") || 0,
    title: get(item, "title") || get(item, "name") || "",
    original_title: get(item, "original_title") || get(item, "original_name") || "",
    overview: get(item, "overview") || "",
    poster_path: get(item, "poster_path") || "",
    backdrop_path: get(item, "backdrop_path") || "",
    release_date: get(item, "release_date") || get(item, "first_air_date") || "",
    vote_average: get(item, "vote_average") || 0,
    vote_count: get(item, "vote_count") || 0,
    genre_ids: get(item, "genre_ids") || [],
    original_language: get(item, "original_language") || "",
  };
};

export const Person = (item?: any): Types.Entity.Person => ({
  id: get(item, "id") || 0,
  type: "person",
  name: get(item, "name") || "",
  profile_path: get(item, "profile_path") || "",
  known_for_department: get(item, "known_for_department") || "",
  ...(get(item, "character") ? { character: get(item, "character") } : {}),
});

export const SearchResult = (item: any, type: SearchType): Types.Entity.SearchResult =>
  type === "person" || get(item, "media_type") === "person"
    ? Person(item)
    : Media(item, type === "multi" ? undefined : type);

export const Image = (item?: any): Types.Entity.Image => ({
  file_path: get(item, "file_path") || "",
  width: get(item, "width") || 0,
  height: get(item, "height") || 0,
  aspect_ratio: get(item, "aspect_ratio") || 0,
  vote_average: get(item, "vote_average") || 0,
  vote_count: get(item, "vote_count") || 0,
  iso_639_1: get(item, "iso_639_1") ?? null,
});

export const Video = (item?: any): Types.Entity.Video => ({
  id: get(item, "id", ""),
  key: get(item, "key", ""),
  name: get(item, "name", ""),
  site: get(item, "site", ""),
  type: get(item, "type", ""),
  official: get(item, "official", true),
  published_at: get(item, "published_at", ""),
});

export const Season = (item?: any): Types.Entity.Season => ({
  id: get(item, "id") || 0,
  name: get(item, "name") || "",
  season_number: get(item, "season_number") || 0,
  poster_path: get(item, "poster_path") || "",
  air_date: get(item, "air_date") || "",
  episode_count: get(item, "episode_count") || 0,
});

export const Genre = (item?: any): Types.Entity.Genre => ({
  id: get(item, "id") || 0,
  name: get(item, "name") || "",
});

export const Details = (item: any, type: MediaType): Types.Entity.Details => ({
  ...Media(item, type),
  tagline: get(item, "tagline") || "",
  status: get(item, "status") || "",
  runtime: get(item, "runtime") || get(item, "episode_run_time[0]") || 0,
  number_of_seasons: get(item, "number_of_seasons") || 0,
  number_of_episodes: get(item, "number_of_episodes") || 0,
  genres: list(item, "genres").map(Genre),
  seasons: list(item, "seasons").map(Season),
  images: {
    posters: list(item, "images.posters").map(Image),
    backdrops: list(item, "images.backdrops").map(Image),
    logos: list(item, "images.logos").map(Image),
  },
  videos: list(item, "videos.results").map(Video),
  cast: list(item, "credits.cast").map(Person),
  recommendations: list(item, "recommendations.results").map(rec => Media(rec, type)),
  collection: get(item, "belongs_to_collection.id")
    ? { id: get(item, "belongs_to_collection.id"), name: get(item, "belongs_to_collection.name") || "" }
    : null,
});

export const PersonDetails = (item: any): Types.Entity.PersonDetails => {
  const seen = new Set<string>();
  const credits = list(item, "combined_credits.cast")
    .filter(credit => credit.poster_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .map(credit => Media(credit))
    .filter(credit => {
      const key = `${credit.type}-${credit.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return {
    ...Person(item),
    biography: get(item, "biography") || "",
    birthday: get(item, "birthday") || "",
    place_of_birth: get(item, "place_of_birth") || "",
    images: list(item, "images.profiles").map(Image),
    credits,
  };
};

export const Paged = <T>(data: any, mapItem: (item: any) => T): Types.Entity.Paged<T> => ({
  items: list(data, "results").map(mapItem),
  page: get(data, "page") || 1,
  totalPages: Math.min(get(data, "total_pages") || 1, 500), // TMDB caps paging at 500
  totalResults: get(data, "total_results") || 0,
});
