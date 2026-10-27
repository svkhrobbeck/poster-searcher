import { useState } from "react";
import { Download, X } from "lucide-react";

import Spinner from "./spinner";
import { GalleryItem } from "./gallery";
import { Button } from "@/components/ui/button";
import { downloadMany } from "@/lib/download";
import { Selection } from "@/hooks/use-selection";

interface SelectionBarProps {
  selection: Selection<GalleryItem>;
  archiveName: string;
}

const SelectionBar = ({ selection, archiveName }: SelectionBarProps) => {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  if (!selection.count && !progress) return null;

  const handleDownload = async () => {
    setProgress({ done: 0, total: selection.count });
    try {
      await downloadMany(selection.items, archiveName, (done, total) =>
        setProgress({ done, total })
      );
      selection.clear();
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4 fade-in-0">
      <div className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 pl-4 shadow-2xl shadow-black/50 backdrop-blur">
        <p className="flex-1 text-sm font-medium">
          {progress ? (
            <>
              Downloading {progress.done}/{progress.total}
            </>
          ) : (
            <>
              {selection.count} selected
            </>
          )}
        </p>
        {!progress && (
          <Button variant="ghost" size="icon" className="h-10" onClick={selection.clear} aria-label="Clear selection">
            <X className="size-5" />
          </Button>
        )}
        <Button className="h-10" onClick={handleDownload} disabled={!!progress}>
          {progress ? (
            <Spinner className="mr-2 size-4 text-slate-900" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          {selection.count > 1 ? "Download ZIP" : "Download"}
        </Button>
      </div>
    </div>
  );
};

export default SelectionBar;
