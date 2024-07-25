import { useSingle } from "@/modules/movies/hooks";
import { Link, useParams } from "react-router-dom";

import Image from "@/components/Image";
import { Card } from "@/components/ui/card";

const Single = () => {
  const id = useParams().id || "";
  const { item } = useSingle(id);

  return (
    <main>
      <section className="flex items-center flex-col justify-start">
        <p className="mb-2">Background Image</p>
        <Card className="mb-5 relative max-w-[400px] w-full p-2">
          <Image className="w-full aspect-video" src={item.backdrop_path} alt="bg" />
          <Link className="absolute inset-0" to={item.backdrop_path} />
        </Card>
        <br />

        <p className="mb-2">Poster Image</p>
        <Card className="relative max-w-[400px] w-full p-2">
          <Image className="w-full aspect-[2/3]" src={item.poster_path} alt="poster" />
          <Link className="absolute inset-0" to={item.poster_path} />
        </Card>
      </section>
    </main>
  );
};
export default Single;
