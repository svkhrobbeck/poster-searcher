import { toast } from "sonner";
import { QueryCache, QueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "./http";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    },
  },
  queryCache: new QueryCache({
    onError: error => toast.error(getErrorMessage(error), { id: "query-error" }),
  }),
});

export default queryClient;
