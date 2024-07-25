import { useState, useEffect } from "react";

const useImageLoad = (src: string) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const img = new Image();

  useEffect(() => {
    img.src = src;

    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError("Image load failed");

    return () => {
      img.onload = null;
      img.onerror = null;
    };

    // eslint-disable-next-line
  }, [src]);

  return { isLoaded, error, img };
};

export default useImageLoad;
