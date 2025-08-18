import axios, { getAdapter } from "axios";

import config from "@/config";

const http = axios.create({
  baseURL: config.api.baseUrl,
  // params: { api_key: config.api.baseApiKey },
  headers: {
    Authorization: `Bearer ${config.api.baseApiToken}`,
  },
  adapter: getAdapter("fetch"),
});

export default http;
