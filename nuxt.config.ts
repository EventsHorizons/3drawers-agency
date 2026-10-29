// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-10-29",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      titleTemplate: "%s",
      title: "monopo london | Tokyo-born design-driven creative agency.",
      meta: [
        {
          name: "description",
          content:
            "DEV RECONSTRUCTION of monopo.london for authorized local development. Not an official Monopo website.",
        },
        { name: "robots", content: "noindex,nofollow" },
      ],
      htmlAttrs: { lang: "en" },
    },
  },
  runtimeConfig: {
    public: {
      isReconstruction: true,
    },
  },
});
