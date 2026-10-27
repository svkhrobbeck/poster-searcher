import cx from "classnames";
import { Loader2 } from "lucide-react";

const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cx("size-10 animate-spin text-slate-400", className)} aria-label="Loading" />
);

export default Spinner;
