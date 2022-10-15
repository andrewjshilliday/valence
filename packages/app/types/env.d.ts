/// <reference types="vite/client" />
/// <reference types="../types" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_TOKEN: string
  readonly VITE_APPLE_MUSIC_API: string
  readonly VITE_VALENCE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
