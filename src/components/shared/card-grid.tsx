import cx from "classnames";
import { ReactNode } from "react";

export const gridClassName =
  "grid grid-cols-2 gap-x-3 gap-y-5 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export const CardGrid = ({ children, className }: CardGridProps) => (
  <div className={cx(gridClassName, className)}>{children}</div>
);

export const CardSkeleton = () => (
  <div>
    <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-slate-800" />
    <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-800" />
    <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded bg-slate-800" />
  </div>
);

export const GridSkeleton = ({ count = 12 }: { count?: number }) => (
  <CardGrid>
    {Array.from({ length: count }, (_, idx) => (
      <CardSkeleton key={idx} />
    ))}
  </CardGrid>
);
