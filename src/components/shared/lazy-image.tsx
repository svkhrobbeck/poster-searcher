import { lazy, Suspense, forwardRef } from "react";
import Skeleton from "react-loading-skeleton";
import { ImageProps } from "./image";

const ImageComponentAsLazy = lazy(() => import("./image"));

const LazyImage = forwardRef<HTMLImageElement, ImageProps>((props, imgRef) => (
  <Suspense
    fallback={
      <Skeleton
        className={props.className}
        baseColor="#334155"
        highlightColor="#0f172a"
        containerClassName="flex"
      />
    }
  >
    <ImageComponentAsLazy {...props} ref={imgRef} />
  </Suspense>
));

export default LazyImage;
