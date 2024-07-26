import { IMovie, IPoster } from "@/helpers/interfaces";

export declare namespace Entity {
  export interface Data extends IMovie {}

  export interface Image extends IPoster {}

  export interface Meta {
    totalPages: number;
    page: number;
    totalResults: number;
  }
}

export declare namespace IApi {
  export interface List {
    results: Entity.Data[];
  }

  export interface Single extends Entity.Data {}

  export interface ImagesList {
    backdrops: Entity.Image[];
    logos: Entity.Image[];
    posters: Entity.Image[];
  }
}

export declare namespace IQuery {
  export interface List {
    items: Entity.Data[];
    meta: Entity.Meta;
  }
  export interface Single {
    item: Entity.Data;
  }

  export interface ImagesList {
    item: {
      backdrops: Entity.Image[];
      logos: Entity.Image[];
      posters: Entity.Image[];
    };
  }
}
