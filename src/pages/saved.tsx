import { Helmet } from "react-helmet";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { useSaved } from "@/hooks/use-library";
import { buttonVariants } from "@/components/ui/button";
import { CardGrid, MediaCard } from "@/components/shared";

const Saved = () => {
  const { items } = useSaved();

  return (
    <>
      <Helmet>
        <title>Saved</title>
      </Helmet>

      <main className="container py-5 sm:py-8">
        <h1 className="mb-1 text-2xl font-bold sm:text-3xl">Saved</h1>
        <p className="mb-6 text-sm text-slate-400">Stored in this browser only</p>

        {items.length ? (
          <CardGrid>
            {items.map(item => (
              <MediaCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </CardGrid>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20 text-center text-slate-400">
            <Heart className="size-10" />
            <p>Nothing saved yet. Tap the heart on any movie or show to keep it here.</p>
            <Link to="/discover" className={buttonVariants({ variant: "secondary" })}>
              Discover something
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default Saved;
