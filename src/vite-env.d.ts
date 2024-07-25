/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string;
  readonly VITE_APP_BASE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
