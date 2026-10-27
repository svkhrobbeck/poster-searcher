import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useSearchParams } from "react-router-dom";

import NotFound from "./not-found";
import useSelection from "@/hooks/use-selection";
import { imageUrl } from "@/helpers/constants";
import { usePerson } from "@/modules/movies/hooks";
import { tabsListClassName, tabTriggerClassName } from "./details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CardGrid,
  Gallery,
  GalleryItem,
  Image,
  MediaCard,
  PageLoader,
  SelectionBar,
} from "@/components/shared";

const PersonView = ({ id }: { id: string }) => {
  const [params, setParams] = useSearchParams();
  const { item, isLoading, isError } = usePerson(id);
  const selection = useSelection<GalleryItem>();
  const [bioExpanded, setBioExpanded] = useState(false);

  const photos = useMemo<GalleryItem[]>(
    () =>
      (item?.images ?? []).map((image, idx) => ({
        id: image.file_path,
        path: image.file_path,
        name: `${item!.name} ${idx + 1} (${image.width}x${image.height})`,
        width: image.width,
        height: image.height,
      })),
    [item]
  );

  if (isLoading) return <PageLoader />;
  if (isError || !item) return <NotFound />;

  const activeTab = params.get("tab") === "credits" ? "credits" : "photos";
  const facts = [
    item.known_for_department,
    item.birthday && new Date(item.birthday).toLocaleDateString("en-GB", { dateStyle: "long" }),
    item.place_of_birth,
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`${item.name} — photos`}</title>
      </Helmet>

      <main className={selection.count ? "pb-24" : undefined}>
        <section className="container grid grid-cols-[7rem_1fr] gap-4 py-6 xs:grid-cols-[9rem_1fr] sm:py-10 md:grid-cols-[14rem_1fr] md:gap-x-8">
          <Image
            className="aspect-[2/3] w-full rounded-xl shadow-2xl ring-1 ring-white/10 md:row-span-2"
            src={imageUrl(item.profile_path, "w500")}
            alt={item.name}
          />
          <div className="flex flex-col justify-end">
            <h1 className="text-2xl font-bold leading-tight sm:text-4xl">{item.name}</h1>
            <div className="mt-2 flex flex-col gap-0.5 text-sm text-slate-400">
              {facts.map(fact => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </div>
          {item.biography && (
            <div className="col-span-2 max-w-3xl md:col-span-1 md:col-start-2">
              <p
                className={
                  "whitespace-pre-line text-sm leading-relaxed text-slate-300 sm:text-base " +
                  (bioExpanded ? "" : "line-clamp-4")
                }
              >
                {item.biography}
              </p>
              {item.biography.length > 300 && (
                <button
                  type="button"
                  className="mt-1 text-sm font-medium text-slate-50 underline underline-offset-4"
                  onClick={() => setBioExpanded(value => !value)}
                >
                  {bioExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </section>

        <section className="container">
          <Tabs value={activeTab} onValueChange={value => setParams({ tab: value }, { replace: true })}>
            <TabsList className={tabsListClassName}>
              <TabsTrigger value="photos" className={tabTriggerClassName}>
                Photos ({photos.length})
              </TabsTrigger>
              <TabsTrigger value="credits" className={tabTriggerClassName}>
                Known for ({item.credits.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              <Gallery items={photos} kind="profile" selection={selection} />
            </TabsContent>
            <TabsContent value="credits">
              <CardGrid>
                {item.credits.map(credit => (
                  <MediaCard key={`${credit.type}-${credit.id}`} item={credit} />
                ))}
              </CardGrid>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SelectionBar selection={selection} archiveName={item.name} />
    </>
  );
};

const Person = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <NotFound />;
  return <PersonView key={id} id={id} />;
};

export default Person;
