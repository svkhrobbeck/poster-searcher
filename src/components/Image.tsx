import cx from "classnames";
import { ComponentProps, Suspense } from "react";
import Skeleton from "react-loading-skeleton";

interface IProps extends ComponentProps<"img"> {
  className?: string;
  alt: string;
  src: string;
  object?: "cover" | "contain";
}

const Image = ({ className, object = "cover", ...props }: IProps) => {
  return (
    <Suspense fallback={<Skeleton containerClassName="flex" />}>
      <img loading="lazy" className={cx("rounded", `object-${object}`, className)} {...props} />
    </Suspense>
  );
};

export default Image;
