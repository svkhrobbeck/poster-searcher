import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { delayRun } from "utilzify";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const downloadImage = async (src: string, name?: string) => {
  const toastId = toast.loading(`${name}ni yuklash boshlandi...`);
  const srcUrl = encodeURIComponent(src);

  const image = await fetch(srcUrl);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = name || "image file name here";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(imageURL);
  toast.success(`${name}ni yuklash yakunlandi!`, { id: toastId });
  await delayRun(3000, () => toast.dismiss(toastId));
};
