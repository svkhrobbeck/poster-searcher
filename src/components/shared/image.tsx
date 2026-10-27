import cx from "classnames";
import { ImageOff } from "lucide-react";
import { ComponentProps, forwardRef, useState } from "react";

export interface ImageProps extends Omit<ComponentProps<"img">, "className"> {
  src: string;
  alt: string;
  /** Applied to the wrapper — give it the size / aspect ratio */
  className?: string;
  object?: "cover" | "contain";
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, object = "cover", src, alt, ...props }, imgRef) => {
    // tracking the loaded src (not a boolean) resets the skeleton when src changes
    const [loadedSrc, setLoadedSrc] = useState("");
    const [failedSrc, setFailedSrc] = useState("");
    const loaded = loadedSrc === src;
    const failed = !src || failedSrc === src;

    return (
      <div className={cx("relative overflow-hidden bg-slate-800", className)}>
        {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-slate-800" />}
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600">
            <ImageOff className="size-8" />
          </div>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
            className={cx(
              "absolute inset-0 size-full transition-opacity duration-300",
              object === "cover" ? "object-cover" : "object-contain",
              loaded ? "opacity-100" : "opacity-0"
            )}
            {...props}
          />
        )}
      </div>
    );
  }
);

export default Image;
