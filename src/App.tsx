import { Route, Routes } from "react-router-dom";

import { Home, NotFound, Single } from "./pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<Single />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
