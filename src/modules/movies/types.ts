export declare namespace Entity {
  export interface Data {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
}

export declare namespace IApi {
  export interface List {
    data: Entity.Data[];
  }

  export interface Single {
    data: Entity.Data;
  }
}

export declare namespace IQuery {
  export interface List {
    items: Entity.Data[];
  }
  export interface Single {
    item: Entity.Data;
  }
}
