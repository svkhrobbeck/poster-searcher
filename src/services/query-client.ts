/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";
import { extractErrorMessage } from "utilzify";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const queryResponseHandler = (data: any) => {
  if (!data) return;


  const message = data["message"] ?? extractErrorMessage(data);
  const error = data["error"];

  if (data["type"] === "ERROR" && error) {
    toast.error(error);
  } else if (data["type"] === "SUCCESS" && message) {
    toast.success(message);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
  queryCache: new QueryCache({
    onSuccess: queryResponseHandler,
    onError: queryResponseHandler,
  }),
  mutationCache: new MutationCache({
    onSuccess: queryResponseHandler,
    onError: queryResponseHandler,
  }),
});

export default queryClient;
