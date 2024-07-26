import { buttonVariants } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const { pathname: route } = useLocation();

  return (
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
  );
};

export default NotFound;
