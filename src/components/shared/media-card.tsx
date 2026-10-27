import cx from "classnames";
import { Link } from "react-router-dom";

import Image from "./image";
import Rating from "./rating";
import { getYear } from "@/lib/utils";
import { imageUrl } from "@/helpers/constants";
import * as Types from "@/modules/movies/types";

interface MediaCardProps {
  item: Types.Entity.Media;
  className?: string;
}

const MediaCard = ({ item, className }: MediaCardProps) => (
  <Link
    to={`/${item.type}/${item.id}`}
    className={cx("group block outline-none", className)}
    title={item.title}
  >
    <div className="relative overflow-hidden rounded-lg ring-1 ring-slate-800 transition group-hover:ring-slate-500 group-focus-visible:ring-2 group-focus-visible:ring-slate-300">
      <Image
        className="aspect-[2/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
        src={imageUrl(item.poster_path, "w342")}
        alt={item.title}
      />
      {item.vote_average > 0 && (
        <span className="absolute left-1.5 top-1.5 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-xs backdrop-blur">
          <Rating value={item.vote_average} />
        </span>
      )}
    </div>
    <p className="mt-2 line-clamp-1 text-sm font-medium">{item.title}</p>
    <p className="text-xs text-slate-400">
      {[getYear(item.release_date), item.type === "tv" ? "TV" : "Movie"].filter(Boolean).join(" · ")}
    </p>
  </Link>
);

export default MediaCard;
