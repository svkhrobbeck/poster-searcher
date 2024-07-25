const ENV = import.meta.env;

const config = {
  app: {
    isDev: ENV.DEV,
  },
  api: {
    baseUrl: ENV.VITE_APP_BASE_API_URL,
    baseApiKey: ENV.VITE_APP_BASE_API_KEY,
  },
};

export default config;
