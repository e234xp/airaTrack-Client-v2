import axios from 'axios';

const axiosInstance = (() => {
  const tmp = axios.create({
    timeout: 20 * 60 * 1000,
    maxContentLength: 1000 * 1000 * 1000,
    maxBodyLength: 1000 * 1000 * 1000,
  });

  tmp.interceptors.request.use((config) => {
    console.log(`send request to ${config.url}`);

    return config;
  }, (error) => {
    console.log();

    return Promise.reject(error);
  });

  tmp.interceptors.response.use((response) => {
    console.log(`get response to ${response.config.url}`);

    return response;
  }, (error) => {
    console.log();

    return Promise.reject(error);
  });

  return tmp;
})();

export default axiosInstance;
