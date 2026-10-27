import cx from "classnames";
import { Star } from "lucide-react";

const Rating = ({ value, className }: { value: number; className?: string }) => {
  if (!value) return null;

  return (
    <span className={cx("inline-flex items-center gap-1 font-semibold text-amber-400", className)}>
      <Star className="size-3.5 fill-current" />
      {value.toFixed(1)}
    </span>
  );
};

export default Rating;
