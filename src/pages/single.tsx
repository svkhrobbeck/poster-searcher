import cx from "classnames";
import Helmet from "react-helmet";
import { Link, useParams } from "react-router-dom";

import { useImagesList, useSingle } from "@/modules/movies/hooks";

import Image from "@/components/Image";
import Spinner from "@/components/Spinner";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import downloadImage from "@/helpers/download-image";
import { buttonVariants } from "@/components/ui/button";
import { Home } from "lucide-react";

const Single = () => {
  const id = useParams().id || "";
  const { item: movie } = useSingle(id);
  const { item: images, isFetched } = useImagesList(id);

  if (!isFetched) {
    return (
      <main className="flex justify-center items-center">
        <Spinner />
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{movie.original_title}</title>
      </Helmet>

      <main>
        <section>
          <h2 className="text-center font-semibold text-4xl py-3">{movie.title}</h2>
          <div className="container">
            <Tabs defaultValue="posters" className="w-full flex flex-col items-center py-5">
              <div className="flex gap-3">
                <Link className={cx(buttonVariants({ variant: "secondary" }))} to="/">
                  <Home className="size-5 mr-2" /> Home
                </Link>
                <TabsList>
                  <TabsTrigger value="posters">Posters</TabsTrigger>
                  <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                  <TabsTrigger value="logos">Logos</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posters">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.posters.map(poster => (
                    <Card
                      className="cursor-pointer max-w-full xs:max-w-[200px] md:max-w-[220px] w-full p-2"
                      onClick={() => downloadImage(poster.file_path, `${movie.title}_poster`)}
                      key={poster.file_path}
                    >
                      <Image className="w-full aspect-[2/3]" src={poster.file_path} alt="poster" />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="backdrops">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.backdrops.map(backdrop => (
                    <Card
                      className="cursor-pointer max-w-[320px] w-full p-2"
                      onClick={() => downloadImage(backdrop.file_path, `${movie.title}_backdrop`)}
                      key={backdrop.file_path}
                    >
                      <Image className="w-full aspect-video" src={backdrop.file_path} alt="bg" />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="logos">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.logos.map(logo => (
                    <Card
                      className="cursor-pointer max-w-[225px] w-full p-2"
                      onClick={() => downloadImage(logo.file_path, `${movie.title}_logo`)}
                      key={logo.file_path}
                    >
                      <Image
                        className="w-full aspect-video object-contain"
                        object="contain"
                        src={logo.file_path}
                        alt="logo"
                      />
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </>
  );
};

export default Single;
