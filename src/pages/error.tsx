import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";

const Error = () => {
  return (
    <>
      <Helmet>
        <title>Unexpected Error:(</title>
      </Helmet>

      <main className="flex justify-center items-center min-h-screen p-4">
        <div className="flex items-center flex-col gap-3 text-center">
          <p className="font-semibold text-2xl sm:text-3xl lg:text-4xl uppercase">
            <span className="text-red-600">Error:</span> You tried to bypass the developer's rules.
          </p>

          <Link className={buttonVariants({ variant: "default" })} to="/">
            Home
          </Link>
        </div>
      </main>
    </>
  );
};

export default Error;
