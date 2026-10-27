import { useState } from "react";
import { Play } from "lucide-react";

import Image from "./image";
import * as Types from "@/modules/movies/types";

// Shows a YouTube thumbnail and loads the heavy iframe only after a click
const Trailer = ({ video }: { video: Types.Entity.Video }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-lg ring-1 ring-slate-800">
        {playing ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0"
            aria-label={`Play ${video.name}`}
          >
            <Image
              className="absolute inset-0"
              src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
              alt={video.name}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-slate-950/20 transition group-hover:bg-slate-950/40">
              <span className="flex size-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110">
                <Play className="ml-1 size-6 fill-white text-white" />
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium">{video.name}</p>
      <p className="text-xs text-slate-400">{video.type}</p>
    </div>
  );
};

export default Trailer;
