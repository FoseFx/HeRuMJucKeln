// https://nuxt.com/docs/api/configuration/nuxt-config

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  ssr: false,
  app: {
    baseURL:
      process.env.NUXT_BASE_URL || isDev
        ? "/"
        : "/teaching/summer-term-2023/daten-die-uns-bewegen/herumjuckeln/herumjuckeln/",
  },
  modules: ["@vueuse/nuxt", "@invictus.codes/nuxt-vuetify"],
  vuetify: {
    moduleOptions: {
      treeshaking: true,
      styles: true,
      autoImport: true,
    },
  },
  runtimeConfig: {
    public: {
      isProd,
      isDev,
      mapbox: {
        pk:
          process.env.MAPBOX_PK ||
          "pk.eyJ1IjoiZm9zZWZ4IiwiYSI6ImNrOGFkOW56ZjAxNjgzZW0za3dxdHFic3UifQ.85f3mrJqSnISFg20Bz0xng", // PK for Max' mapbox account
        style: {
          light: "mapbox://styles/fosefx/clgoas59s00f701pcg6qud1hh", // Decimal Light
          dark: "mapbox://styles/fosefx/clgobc19v00gn01qxgrex6vms", // Decimal Dark
        },
        apiHost: process.env.MAPBOX_HOST || "https://api.mapbox.com",
      },
      apiHost: process.env.IVU_API_HOST || "https://rwth.ivu.de/fl",
    },
  },
  css: [
    "@/assets/css/reset.css",
    "@/assets/css/styles.css",
    "@/assets/css/roboto.css",
  ],
});
