import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const Home = lazy(() => import("@/pages/home"));
const Error = lazy(() => import("@/pages/error"));
const Search = lazy(() => import("@/pages/search"));
const Saved = lazy(() => import("@/pages/saved"));
const Person = lazy(() => import("@/pages/person"));
const Details = lazy(() => import("@/pages/details"));
const Discover = lazy(() => import("@/pages/discover"));
const NotFound = lazy(() => import("@/pages/not-found"));

import { Footer, Header, PageLoader } from "@/components/shared";

const App = () => {
  const { pathname } = useLocation();

  // scroll to top on page change only (not on tab / filter query changes)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/:type/:id" element={<Details />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default App;
