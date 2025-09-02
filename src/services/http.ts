import axios, { getAdapter } from "axios";
import { axiosErrorHandler } from "utilzify";

import config from "@/config";

const msgLogger = (_d: unknown, msg: string) => console.error(msg);

const http = axios.create({
  baseURL: config.api.baseUrl,
  // params: { api_key: config.api.baseApiKey },
  headers: {
    Authorization: `Bearer ${config.api.baseApiToken}`,
  },
  adapter: getAdapter("fetch"),
});

http.interceptors.request.use(c => c, axiosErrorHandler(msgLogger, false));
http.interceptors.response.use(c => c, axiosErrorHandler(msgLogger, false));

export default http;
