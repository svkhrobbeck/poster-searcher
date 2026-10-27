import cx from "classnames";
import { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const Chip = ({ active, className, ...props }: ChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    className={cx(
      "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-slate-50 bg-slate-50 text-slate-900"
        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-slate-50",
      className
    )}
    {...props}
  />
);

export default Chip;
