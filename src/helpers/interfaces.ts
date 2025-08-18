import { FC } from "react";

import { searchValues } from "./constants";

export interface ITab {
  label: string;
  value: string;
  components: FC[];
  inactive?: boolean;
}

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IPoster {
  aspect_ratio: number;
  height: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface IVideo {
  name: string;
  key: string;
  site: string;
  size: number;
  type: ContentType;
  official: true;
  published_at: string;
  id: string;
}

export type ContentType =
  | "Trailer"
  | "Clip"
  | "Featurette"
  | "Opening Credits"
  | "Behind the Scenes";

export type SearchUnionType = (typeof searchValues)[number];
