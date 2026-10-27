export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
// Same-origin fallback (Vercel rewrite / Vite proxy) used when a direct CORS fetch fails
export const IMAGE_PROXY_URL = "/tmdb-image";

export type ImageSize = "w92" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export const imageUrl = (path?: string | null, size: ImageSize = "original") =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : "";

export const mediaTypes = ["movie", "tv"] as const;

export const searchTypes = [
  { value: "multi", title: "All" },
  { value: "movie", title: "Movies" },
  { value: "tv", title: "TV Shows" },
  { value: "person", title: "People" },
] as const;

export const sortOptions = [
  { value: "popularity.desc", title: "Most popular" },
  { value: "vote_average.desc", title: "Top rated" },
  { value: "vote_count.desc", title: "Most voted" },
  { value: "newest", title: "Newest" },
] as const;

export const ANIME_GENRE_ID = "16";
export const ANIME_LANGUAGE = "ja";
