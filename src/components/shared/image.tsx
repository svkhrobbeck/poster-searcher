import cx from "classnames";
import Skeleton from "react-loading-skeleton";
import { ComponentProps, forwardRef, useState } from "react";

export interface ImageProps extends ComponentProps<"img"> {
  className?: string;
  alt: string;
  src: string;
  object?: "cover" | "contain";
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, object = "cover", ...props }, imgRef) => {
    const [loaded, setLoaded] = useState(false);

    const handleImageLoad = () => setLoaded(true);

    return (
      <div className="relative">
        <img
          loading="lazy"
          onLoad={handleImageLoad}
          ref={imgRef}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
          className={cx("rounded", `object-${object}`, className)}
          {...props}
        />
        {!loaded && (
          <Skeleton
            className={className}
            baseColor="#334155"
            highlightColor="#0f172a"
            containerClassName="flex absolute top-0 left-0 w-full h-full"
          />
        )}
      </div>
    );
  }
);

export default Image;
