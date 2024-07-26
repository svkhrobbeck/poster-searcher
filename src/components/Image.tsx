import cx from "classnames";
import Skeleton from "react-loading-skeleton";

import useImageLoad from "@/hooks/useImageLoad";

interface IProps {
  className?: string;
  alt: string;
  src: string;
  object?: "cover" | "contain";
}

const Image = ({ className, object = "cover", ...props }: IProps) => {
  const { isLoaded } = useImageLoad(props.src);

  return (
    <>
      {isLoaded ? (
        <img className={cx("rounded", `object-${object}`, className)} {...props} />
      ) : (
        <Skeleton containerClassName="flex" className={className} />
      )}
    </>
  );
};

export default Image;
