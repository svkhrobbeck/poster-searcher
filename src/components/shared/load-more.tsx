import { useEffect, useRef } from "react";

import Spinner from "./spinner";
import { Button } from "@/components/ui/button";

interface LoadMoreProps {
  hasNextPage: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
}

// Loads the next page automatically when scrolled into view, with a button as fallback
const LoadMore = ({ hasNextPage, isFetching, onLoadMore }: LoadMoreProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && onLoadMore(), {
      rootMargin: "600px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="flex justify-center py-8">
      {isFetching ? (
        <Spinner className="size-8" />
      ) : (
        <Button variant="secondary" onClick={onLoadMore}>
          Load more
        </Button>
      )}
    </div>
  );
};

export default LoadMore;
