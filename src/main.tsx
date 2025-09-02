import "@/bootstrap";

import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import { queryClient } from "@/services";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <Analytics />
      <Toaster
        richColors
        expand
        position="top-right"
        closeButton
        duration={25000}
        theme="dark"
        visibleToasts={12}
      />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </BrowserRouter>
);
