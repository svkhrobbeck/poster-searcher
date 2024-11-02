import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";

import { buttonVariants } from "@/components/ui";

const NotFound = () => {
  const { pathname: route } = useLocation();

  return (
    <>
      <Helmet>
        <title>{route} page not found</title>
      </Helmet>

      <main className="flex justify-center items-center">
        <div className="flex items-center flex-col gap-3">
          <p className="font-semibold text-3xl uppercase">
            <span className="text-green-600">{route}</span> page not found
          </p>

          <Link className={buttonVariants({ variant: "default" })} to="/">
            Home
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
