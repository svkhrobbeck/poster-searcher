import { lazy, Suspense } from "react";
import DisableDevtool from "disable-devtool";
import { Route, Routes } from "react-router-dom";

import Spinner from "./components/Spinner";
const Home = lazy(() => import("./pages/home"));
const Error = lazy(() => import("./pages/error"));
const Single = lazy(() => import("./pages/single"));
const NotFound = lazy(() => import("./pages/not-found"));

const App = () => {
  DisableDevtool({
    url: "/error",
    ignore: () => import.meta.env.DEV,
  });

  return (
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
  );
};

export default App;
