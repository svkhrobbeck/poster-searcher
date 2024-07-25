import cx from "classnames";
import Skeleton from "react-loading-skeleton";

import useImageLoad from "@/hooks/useImageLoad";

interface IProps {
  className?: string;
  alt: string;
  src: string;
}

const Image = ({ className, src, alt }: IProps) => {
  const { isLoaded } = useImageLoad(src);

  return (
    <>
      {isLoaded ? (
        <img className={cx("object-cover", className)} src={src} alt={alt} />
      ) : (
        <div className="relative">
          <Skeleton containerClassName="flex" className={className} />
        </div>
      )}
    </>
  );
};

export default Image;
