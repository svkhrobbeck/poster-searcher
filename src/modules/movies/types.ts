import { MediaType } from "@/helpers/interfaces";

export declare namespace Entity {
  export interface Media {
    id: number;
    type: MediaType;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    original_language: string;
  }

  export interface Person {
    id: number;
    type: "person";
    name: string;
    profile_path: string;
    known_for_department: string;
    character?: string;
  }

  export type SearchResult = Media | Person;

  export interface Image {
    file_path: string;
    width: number;
    height: number;
    aspect_ratio: number;
    vote_average: number;
    vote_count: number;
    iso_639_1: string | null;
  }

  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
    published_at: string;
  }

  export interface Season {
    id: number;
    name: string;
    season_number: number;
    poster_path: string;
    air_date: string;
    episode_count: number;
  }

  export interface Genre {
    id: number;
    name: string;
  }

  export interface Images {
    posters: Image[];
    backdrops: Image[];
    logos: Image[];
  }

  export interface Details extends Media {
    tagline: string;
    status: string;
    runtime: number;
    number_of_seasons: number;
    number_of_episodes: number;
    genres: Genre[];
    seasons: Season[];
    images: Images;
    videos: Video[];
    cast: Person[];
    recommendations: Media[];
    collection: { id: number; name: string } | null;
  }

  export interface PersonDetails extends Person {
    biography: string;
    birthday: string;
    place_of_birth: string;
    images: Image[];
    credits: Media[];
  }

  export interface Paged<T> {
    items: T[];
    page: number;
    totalPages: number;
    totalResults: number;
  }
}
