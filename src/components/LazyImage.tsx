import { lazy, Suspense, forwardRef } from "react";
import Skeleton from "react-loading-skeleton";
import { ImageProps } from "./Image";

const LazyImageComponent = lazy(() => import("./Image"));

const LazyImage = forwardRef<HTMLImageElement, ImageProps>((props, imgRef) => (
  <Suspense fallback={<Skeleton className={props.className} containerClassName="flex" />}>
    <LazyImageComponent {...props} ref={imgRef} />
  </Suspense>
));

export default LazyImage;
