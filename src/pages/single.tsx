import cx from "classnames";
import Helmet from "react-helmet";
import { Home } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { useImagesList, useSingle } from "@/modules/movies/hooks";

import Image from "@/components/Image";
import Spinner from "@/components/Spinner";
import { Card } from "@/components/ui/card";
import downloadImage from "@/helpers/download-image";
import { SearchUnionType } from "@/helpers/interfaces";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Single = () => {
  const id = useParams().id || "";
  const [params] = useSearchParams();
  const type = params.get("type") as SearchUnionType;

  const { item: movie } = useSingle(id, type);
  const { item: images, isFetched } = useImagesList(id, type);

  if (!isFetched)
    return (
      <main className="flex justify-center items-center">
        <Spinner />
      </main>
    );

  return (
    <>
      <Helmet>
        <title>{movie.title || movie.original_title || movie.original_name}</title>
      </Helmet>

      <main>
        <section>
          <h2 className="text-center text-3xl md:text-5xl font-semibold pt-3 mb-2 md:mb-5">
            {movie.title || movie.original_title || movie.original_name}
          </h2>
          <div className="container">
            <Tabs defaultValue="posters" className="w-full flex flex-col items-center py-5">
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  className={cx("w-full xs:w-auto", buttonVariants({ variant: "secondary" }))}
                  to="/"
                >
                  <Home className="size-5 mr-2" /> Home
                </Link>
                <TabsList className="w-full xs:w-auto">
                  <TabsTrigger value="posters">Posters</TabsTrigger>
                  <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                  <TabsTrigger value="logos">Logos</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posters">
                <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                  {images.posters.map(poster => (
                    <Card
                      className="cursor-pointer max-w-[47%]  xs:max-w-[200px] md:max-w-[220px] w-full p-2"
                      onClick={() => downloadImage(poster.file_path, `${movie.title} Poster`)}
                      key={poster.file_path}
                    >
                      <Image
                        className="w-full aspect-[2/3]"
                        src={poster.file_path}
                        alt="poster"
                        title="yuklab olish uchun rasm ustiga bosing"
                      />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="backdrops">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.backdrops.map(backdrop => (
                    <Card
                      className="cursor-pointer max-w-full xs:max-w-[150px] sm:max-w-[200px] md:max-w-[220px] w-full p-2"
                      onClick={() => downloadImage(backdrop.file_path, `${movie.title} Backdrop`)}
                      key={backdrop.file_path}
                    >
                      <Image
                        className="w-full aspect-video"
                        src={backdrop.file_path}
                        alt="bg"
                        title="yuklab olish uchun rasm ustiga bosing"
                      />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="logos">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {images.logos.map(logo => (
                    <Card
                      className="cursor-pointer max-w-[48%] xs:max-w-[155px] md:max-w-[200px] w-full p-2"
                      onClick={() => downloadImage(logo.file_path, `${movie.title} Logo`)}
                      key={logo.file_path}
                    >
                      <Image
                        className="w-full aspect-video object-contain"
                        object="contain"
                        src={logo.file_path}
                        alt="logo"
                        title="yuklab olish uchun rasm ustiga bosing"
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
