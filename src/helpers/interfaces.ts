import { mediaTypes, searchTypes, sortOptions } from "./constants";

export type MediaType = (typeof mediaTypes)[number];

export type SearchType = (typeof searchTypes)[number]["value"];

export type SortType = (typeof sortOptions)[number]["value"];

export const isMediaType = (value?: string): value is MediaType =>
  mediaTypes.includes(value as MediaType);
