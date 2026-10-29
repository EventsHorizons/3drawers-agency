// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-10-29",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      titleTemplate: "%s",
      title: "3Drawers | Agency",
      meta: [
        {
          name: "description",
          content:
            "3Drawers Agency — design-driven creative studio for branding, digital and communications.",
        },
        { name: "robots", content: "noindex,nofollow" },
      ],
      htmlAttrs: { lang: "en" },
    },
  },
  runtimeConfig: {
    public: {
      brandName: "3Drawers | Agency",
    },
  },
});
