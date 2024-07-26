import Helmet from "react-helmet";
import { Link, useParams } from "react-router-dom";

import { useImagesList, useSingle } from "@/modules/movies/hooks";

import Image from "@/components/Image";
import Spinner from "@/components/Spinner";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <TabsList>
                <TabsTrigger value="posters">Posters</TabsTrigger>
                <TabsTrigger value="backdrops">Backdrops</TabsTrigger>
                <TabsTrigger value="logos">Logos</TabsTrigger>
              </TabsList>

              <TabsContent value="posters">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.posters.map(poster => (
                    <Card
                      className="relative max-w-full xs:max-w-[200px] md:max-w-[220px] w-full p-2"
                      key={poster.file_path}
                    >
                      <Image className="w-full aspect-[2/3]" src={poster.file_path} alt="poster" />
                      <Link className="absolute inset-0" to={poster.file_path} />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="backdrops">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.backdrops.map(backdrop => (
                    <Card className="relative max-w-[320px] w-full p-2" key={backdrop.file_path}>
                      <Image className="w-full aspect-video" src={backdrop.file_path} alt="bg" />
                      <Link className="absolute inset-0" to={backdrop.file_path} />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="logos">
                <div className="flex flex-wrap gap-3 justify-center">
                  {images.logos.map(logo => (
                    <Card className="relative max-w-[225px] w-full p-2" key={logo.file_path}>
                      <Image
                        className="w-full aspect-video object-contain"
                        object="contain"
                        src={logo.file_path}
                        alt="logo"
                      />
                      <Link className="absolute inset-0" to={logo.file_path} />
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
