import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { useEffect, useMemo } from "react";
import { Heart, Share2 } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import NotFound from "./not-found";
import useSelection from "@/hooks/use-selection";
import { Button } from "@/components/ui/button";
import { useRecent, useSaved } from "@/hooks/use-library";
import { useCollection, useDetails } from "@/modules/movies/hooks";
import * as Types from "@/modules/movies/types";
import { MediaType, isMediaType } from "@/helpers/interfaces";
import { imageUrl } from "@/helpers/constants";
import { cn, formatRuntime, getYear } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CardGrid,
  Gallery,
  GalleryItem,
  Image,
  MediaRow,
  PageLoader,
  PersonCard,
  Rating,
  SelectionBar,
  Trailer,
} from "@/components/shared";

const toGalleryItems = (images: Types.Entity.Image[], title: string, label: string): GalleryItem[] =>
  images.map((image, idx) => ({
    id: image.file_path,
    path: image.file_path,
    name: `${title} - ${label} ${idx + 1} (${image.width}x${image.height})`,
    width: image.width,
    height: image.height,
    lang: image.iso_639_1,
  }));

export const tabTriggerClassName = "gap-1.5 px-3 sm:px-4";
export const tabsListClassName =
  "mb-5 flex h-auto w-full justify-start overflow-x-auto rounded-xl p-1 scrollbar-hide sm:w-fit";

const sharePage = async (title: string) => {
  const url = window.location.origin + window.location.pathname;
  try {
    // native share sheet on phones, clipboard on desktop
    if (navigator.share) return await navigator.share({ title, url });
    await navigator.clipboard.writeText(url);
    toast.success("Sahifa linki nusxalandi", { duration: 2000 });
  } catch (error) {
    if ((error as Error)?.name !== "AbortError") toast.error("Ulashib bo'lmadi");
  }
};

const Counter = ({ value }: { value: number }) => (
  <span className="rounded-full bg-slate-700/70 px-1.5 text-[11px] leading-4 text-slate-300">
    {value}
  </span>
);

const DetailsView = ({ type, id }: { type: MediaType; id: string }) => {
  const [params, setParams] = useSearchParams();
  const { item, isLoading, isError } = useDetails(type, id);
  const selection = useSelection<GalleryItem>();

  const { isSaved, toggle: toggleSaved } = useSaved();
  const { add: addRecent } = useRecent();
  const { items: collectionParts } = useCollection(item?.collection?.id);

  const title = item?.title || item?.original_title || "";

  useEffect(() => {
    if (item) addRecent(item);
  }, [item, addRecent]);

  const galleries = useMemo(() => {
    if (!item) return null;
    return {
      posters: toGalleryItems(item.images.posters, title, "Poster"),
      backdrops: toGalleryItems(item.images.backdrops, title, "Backdrop"),
      logos: toGalleryItems(item.images.logos, title, "Logo"),
      seasons: item.seasons
        .filter(season => season.poster_path)
        .map(season => ({
          id: season.poster_path,
          path: season.poster_path,
          name: `${title} - ${season.name}`,
          caption: season.name,
        })),
    };
  }, [item, title]);

  if (isLoading) return <PageLoader />;
  if (isError || !item || !galleries) return <NotFound />;

  const trailers = item.videos
    .filter(video => video.site === "YouTube")
    .sort((a, b) => Number(b.type === "Trailer") - Number(a.type === "Trailer"));

  const tabs = [
    { value: "posters", title: "Posters", count: galleries.posters.length },
    { value: "backdrops", title: "Backgrounds", count: galleries.backdrops.length },
    { value: "logos", title: "Logos", count: galleries.logos.length },
    ...(type === "tv" ? [{ value: "seasons", title: "Seasons", count: galleries.seasons.length }] : []),
    { value: "trailers", title: "Trailers", count: trailers.length },
    { value: "cast", title: "Cast", count: item.cast.length },
  ];
  const activeTab = tabs.find(tab => tab.value === params.get("tab"))?.value ?? "posters";

  const meta = [
    getYear(item.release_date),
    type === "movie"
      ? formatRuntime(item.runtime)
      : item.number_of_seasons
        ? `${item.number_of_seasons} season${item.number_of_seasons > 1 ? "s" : ""}`
        : "",
    type === "tv" ? "TV Show" : "Movie",
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`${title} — posters & backdrops`}</title>
      </Helmet>

      <main className={selection.count ? "pb-24" : undefined}>
        <section className="relative isolate overflow-hidden">
          {item.backdrop_path && (
            <>
              <img
                src={imageUrl(item.backdrop_path, "w1280")}
                alt=""
                className="absolute inset-0 -z-10 size-full object-cover object-top opacity-35"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
            </>
          )}

          <div className="container grid grid-cols-[7rem_1fr] gap-x-4 gap-y-4 py-6 xs:grid-cols-[9rem_1fr] sm:py-10 md:grid-cols-[14rem_1fr] md:gap-x-8">
            <Image
              className="aspect-[2/3] w-full rounded-xl shadow-2xl ring-1 ring-white/10 md:row-span-2"
              src={imageUrl(item.poster_path, "w500")}
              alt={title}
            />

            <div className="flex flex-col justify-end md:justify-end">
              <h1 className="text-xl font-bold leading-tight xs:text-2xl sm:text-4xl">{title}</h1>
              {item.original_title && item.original_title !== title && (
                <p className="mt-1 text-sm text-slate-400">{item.original_title}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                <Rating value={item.vote_average} />
                {meta.map(value => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              {!!item.genres.length && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.genres.map(genre => (
                    <Link
                      key={genre.id}
                      to={`/discover?type=${type}&genre=${genre.id}`}
                      className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-50"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant={isSaved(item) ? "default" : "secondary"}
                  className="h-9 px-3"
                  onClick={() => toggleSaved(item)}
                  aria-pressed={isSaved(item)}
                >
                  <Heart className={cn("size-4 xs:mr-1.5", isSaved(item) && "fill-rose-500 text-rose-500")} />
                  <span className="hidden xs:inline">{isSaved(item) ? "Saved" : "Save"}</span>
                </Button>
                <Button variant="secondary" className="h-9 px-3" onClick={() => sharePage(title)}>
                  <Share2 className="size-4 xs:mr-1.5" />
                  <span className="hidden xs:inline">Share</span>
                </Button>
              </div>
            </div>

            {(item.tagline || item.overview) && (
              <div className="col-span-2 max-w-3xl md:col-span-1 md:col-start-2">
                {item.tagline && <p className="mb-2 italic text-slate-400">{item.tagline}</p>}
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{item.overview}</p>
              </div>
            )}
          </div>
        </section>

        <section className="container pt-2">
          <Tabs
            value={activeTab}
            onValueChange={value => setParams({ tab: value }, { replace: true })}
          >
            <TabsList className={tabsListClassName}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClassName}>
                  {tab.title} <Counter value={tab.count} />
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="posters">
              <Gallery items={galleries.posters} kind="poster" selection={selection} />
            </TabsContent>
            <TabsContent value="backdrops">
              <Gallery items={galleries.backdrops} kind="backdrop" selection={selection} />
            </TabsContent>
            <TabsContent value="logos">
              <Gallery items={galleries.logos} kind="logo" selection={selection} />
            </TabsContent>
            {type === "tv" && (
              <TabsContent value="seasons">
                <Gallery items={galleries.seasons} kind="poster" selection={selection} />
              </TabsContent>
            )}
            <TabsContent value="trailers">
              {trailers.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {trailers.map(video => (
                    <Trailer key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-slate-400">Trailers not found</p>
              )}
            </TabsContent>
            <TabsContent value="cast">
              {item.cast.length ? (
                <CardGrid>
                  {item.cast.map(person => (
                    <PersonCard key={`${person.id}-${person.character}`} item={person} />
                  ))}
                </CardGrid>
              ) : (
                <p className="py-16 text-center text-slate-400">Cast not found</p>
              )}
            </TabsContent>
          </Tabs>
        </section>

        <div className="mt-6">
          {item.collection && collectionParts.length > 1 && (
            <MediaRow title={item.collection.name} items={collectionParts} />
          )}
          <MediaRow title="You may also like" items={item.recommendations} />
        </div>
      </main>

      <SelectionBar selection={selection} archiveName={title} />
    </>
  );
};

const Details = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  if (!isMediaType(type) || !id) return <NotFound />;

  // keyed so selection and local state never leak from one title into another
  return <DetailsView key={`${type}-${id}`} type={type} id={id} />;
};

export default Details;
