import cx from "classnames";
import Skeleton from "react-loading-skeleton";
import { ComponentProps, forwardRef, useState } from "react";

export interface ImageProps extends ComponentProps<"img"> {
  className?: string;
  alt: string;
  src: string;
  object?: "cover" | "contain";
  fallbackSrc?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, object = "cover", fallbackSrc, ...props }, imgRef) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleImageLoad = () => setLoaded(true);
    const handleImageError = () => {
      setError(true);
      setLoaded(true);
    };

    return (
      <div className="relative">
        <img
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          ref={imgRef}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
          className={cx("rounded", `object-${object}`, className)}
          {...props}
          src={error && fallbackSrc ? fallbackSrc : props.src}
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
