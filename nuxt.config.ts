// https://nuxt.com/docs/api/configuration/nuxt-config

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  ssr: false,
  app: {
    baseURL: isDev
      ? "/"
      : "/teaching/summer-term-2023/daten-die-uns-bewegen/herumjuckeln/herumjuckeln/",
  },
  modules: ["@vueuse/nuxt", "@invictus.codes/nuxt-vuetify"],
  vuetify: {
    vuetifyOptions: {},
    moduleOptions: {
      treeshaking: true,
      styles: true,
      autoImport: true,
    },
  },
});
