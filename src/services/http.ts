import axios from "axios";

import config from "@/config";

const http = axios.create({
  baseURL: config.api.baseUrl,
  params: { api_key: config.api.baseApiKey },
});

export default http;
