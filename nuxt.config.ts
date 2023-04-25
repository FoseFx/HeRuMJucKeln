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
  runtimeConfig: {
    public: {
      isProd,
      isDev,
      mapbox: {
        pk: "pk.eyJ1IjoiZm9zZWZ4IiwiYSI6ImNrOGFkOW56ZjAxNjgzZW0za3dxdHFic3UifQ.85f3mrJqSnISFg20Bz0xng", // PK for Max' mapbox account
        style: {
          light: "mapbox://styles/fosefx/clgoas59s00f701pcg6qud1hh", // Decimal Light
          dark: "mapbox://styles/fosefx/clgobc19v00gn01qxgrex6vms", // Decimal Dark
        },
      },
    },
  },
});
