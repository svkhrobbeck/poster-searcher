import disableDevtool from "disable-devtool";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const Home = lazy(() => import("@/pages/home"));
const Error = lazy(() => import("@/pages/error"));
const Single = lazy(() => import("@/pages/single"));
const NotFound = lazy(() => import("@/pages/not-found"));

import { Footer, Spinner } from "@/components/shared";

const App = () => {
  const location = useLocation();
  disableDevtool({ url: "/error", ignore: () => import.meta.env.DEV });

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [location]);

  return (
    <>
      <Suspense
        fallback={
          <main className="flex justify-center items-center">
            <Spinner />
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:type/:id" element={<Single />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default App;
