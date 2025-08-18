const ENV = import.meta.env;

const config = {
  app: {
    isDev: ENV.DEV,
  },
  api: {
    baseUrl: ENV.VITE_APP_BASE_API_URL,
    baseApiToken: ENV.VITE_APP_BASE_API_TOKEN,
    // baseApiKey: ENV.VITE_APP_BASE_API_KEY,
  },
};

export default config;
