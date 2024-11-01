import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DisableDevtool from "disable-devtool";

import Spinner from "./components/Spinner";
import NotFound from "./pages/not-found";
const Home = lazy(() => import("./pages/home"));
const Single = lazy(() => import("./pages/single"));

const App = () => {
  DisableDevtool({
    url: "/404",
    ignore: () => {
      return import.meta.env.DEV;
    },
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
        <Route path="/:id" element={<Single />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
