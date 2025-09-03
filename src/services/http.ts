import axios, { getAdapter } from "axios";

import config from "@/config";
import { axiosErrorHandler } from "utilzify";

const msgLogger = (_d: unknown, msg: string) => console.error(msg);

const http = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    Authorization: `Bearer ${config.api.baseApiToken}`,
  },
  adapter: getAdapter("fetch"),
});

http.interceptors.request.use(c => c, axiosErrorHandler(msgLogger, true));
http.interceptors.response.use(c => c, axiosErrorHandler(msgLogger, true));

export default http;
