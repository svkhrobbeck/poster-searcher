import axios, { getAdapter, isAxiosError } from "axios";

import config from "@/config";

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.status_message || error.message;
  }
  return error instanceof Error ? error.message : String(error);
};

const http = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    Authorization: `Bearer ${config.api.baseApiToken}`,
  },
  adapter: getAdapter("fetch"),
});

http.interceptors.response.use(
  res => res,
  error => {
    console.error(getErrorMessage(error));
    return Promise.reject(error);
  }
);

export default http;
