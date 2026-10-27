import cx from "classnames";
import { Link } from "react-router-dom";

import Image from "./image";
import { imageUrl } from "@/helpers/constants";
import * as Types from "@/modules/movies/types";

interface PersonCardProps {
  item: Types.Entity.Person;
  className?: string;
}

const PersonCard = ({ item, className }: PersonCardProps) => (
  <Link to={`/person/${item.id}`} className={cx("group block outline-none", className)}>
    <div className="overflow-hidden rounded-lg ring-1 ring-slate-800 transition group-hover:ring-slate-500 group-focus-visible:ring-2 group-focus-visible:ring-slate-300">
      <Image
        className="aspect-[2/3] w-full"
        src={imageUrl(item.profile_path, "w185")}
        alt={item.name}
      />
    </div>
    <p className="mt-2 line-clamp-1 text-sm font-medium">{item.name}</p>
    <p className="line-clamp-1 text-xs text-slate-400">
      {item.character || item.known_for_department}
    </p>
  </Link>
);

export default PersonCard;
