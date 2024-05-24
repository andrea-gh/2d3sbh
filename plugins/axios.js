import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const directus = axios.create({
    baseURL: config.public.directusUrl,
    headers: {
      Authorization: `Bearer ${config.public.directusToken}`,
    },
  });

  nuxtApp.provide('directus', directus);
});
