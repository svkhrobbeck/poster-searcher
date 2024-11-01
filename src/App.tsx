import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Spinner from "./components/Spinner";
const Home = lazy(() => import("./pages/home"));
const Single = lazy(() => import("./pages/single"));
const NotFound = lazy(() => import("./pages/not-found"));

const App = () => {
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
