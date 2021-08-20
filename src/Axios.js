import axios from 'axios';

import { STORAGE_KEYS } from './constants';

const Axios = axios.create({
  baseURL: `${process.env.SERVER_URL}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(
  (config) => {
    const configModified = config;
    /**
     * Contrôle window uniquement pour éviter les erreurs côté serveur Next.js
     * A vérifier si une optimisation est possible.
     * Source : https://spectrum.chat/next-js/general/localstorage-is-not-defined~6a6798f7-63b0-4184-9861-e66f5dce3934
     */
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    ) {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (accessToken) {
        configModified.headers.authorization = `Token ${accessToken}`;
      }
    }
    // console.log("Interceptor is called !");
    return configModified;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default Axios;
