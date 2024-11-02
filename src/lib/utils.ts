import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const downloadImage = async (src: string, name?: string) => {
  const srcUrl = "https://corsproxy.io/?" + encodeURIComponent(src);

  const image = await fetch(srcUrl);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = name || "image file name here";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
