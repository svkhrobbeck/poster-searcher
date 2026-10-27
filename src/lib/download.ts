import { toast } from "sonner";
import { zip } from "fflate";

import { IMAGE_PROXY_URL, imageUrl } from "@/helpers/constants";

export interface DownloadItem {
  /** TMDB file path, e.g. "/abc.jpg" */
  path: string;
  /** File name without extension */
  name: string;
}

const CONCURRENCY = 4;

const sanitize = (name: string) =>
  name.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim() || "image";

const extension = (path: string) => path.match(/\.\w+$/)?.[0] ?? ".jpg";

// image.tmdb.org sends `Access-Control-Allow-Origin: *`, so a direct fetch works without
// any third-party proxy. The same-origin rewrite is only a fallback for blocked networks.
const fetchImage = async (path: string): Promise<Blob> => {
  const sources = [imageUrl(path, "original"), `${IMAGE_PROXY_URL}/original${path}`];

  for (const src of sources) {
    try {
      const res = await fetch(src, { mode: "cors", cache: "force-cache" });
      if (res.ok && res.headers.get("content-type")?.startsWith("image/")) return await res.blob();
    } catch {
      // try the next source
    }
  }

  throw new Error(`Failed to fetch ${path}`);
};

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari needs the URL to live a bit after the click
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export const downloadImage = async ({ path, name }: DownloadItem) => {
  const fileName = sanitize(name) + extension(path);
  const toastId = toast.loading(`${fileName} yuklanmoqda...`);

  try {
    saveBlob(await fetchImage(path), fileName);
    toast.success(`${fileName} yuklab olindi`, { id: toastId, duration: 3000 });
  } catch {
    toast.error("Rasmni yuklab bo'lmadi. Yangi oynada ochildi.", { id: toastId, duration: 5000 });
    window.open(imageUrl(path, "original"), "_blank", "noopener");
  }
};

const zipAsync = (files: Record<string, Uint8Array>) =>
  new Promise<Uint8Array>((resolve, reject) =>
    // images are already compressed, level 0 just stores them (fast)
    zip(files, { level: 0 }, (err, data) => (err ? reject(err) : resolve(data)))
  );

export const downloadMany = async (
  items: DownloadItem[],
  archiveName: string,
  onProgress?: (done: number, total: number) => void
) => {
  if (!items.length) return;
  if (items.length === 1) return downloadImage(items[0]);

  const total = items.length;
  const toastId = toast.loading(`Tayyorlanmoqda: 0 / ${total}`);
  const files: Record<string, Uint8Array> = {};
  const usedNames = new Set<string>();
  let done = 0;
  let failed = 0;

  const queue = [...items];
  const worker = async () => {
    while (queue.length) {
      const item = queue.shift()!;
      try {
        const blob = await fetchImage(item.path);
        let fileName = sanitize(item.name) + extension(item.path);
        for (let i = 2; usedNames.has(fileName); i++) {
          fileName = `${sanitize(item.name)} (${i})${extension(item.path)}`;
        }
        usedNames.add(fileName);
        files[fileName] = new Uint8Array(await blob.arrayBuffer());
      } catch {
        failed++;
      }
      done++;
      onProgress?.(done, total);
      toast.loading(`Tayyorlanmoqda: ${done} / ${total}`, { id: toastId });
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));

  if (!Object.keys(files).length) {
    toast.error("Rasmlarni yuklab bo'lmadi", { id: toastId, duration: 5000 });
    return;
  }

  const archive = await zipAsync(files);
  saveBlob(new Blob([archive], { type: "application/zip" }), `${sanitize(archiveName)}.zip`);

  const okCount = total - failed;
  toast.success(
    failed ? `${okCount} ta yuklandi, ${failed} tasi xato` : `${okCount} ta rasm ZIP qilib yuklandi`,
    { id: toastId, duration: 4000 }
  );
};
