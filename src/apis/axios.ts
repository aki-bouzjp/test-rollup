import axios from 'axios';
import { config } from 'utils/config';

type OPTIONS = {
  baseURL?: string;
  isBlob?: boolean;
};

export const axiosInstance = (options: OPTIONS = {}) => {
  const { baseURL, isBlob } = options;
  return axios.create({
    baseURL: baseURL || config.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 30,
    responseType: isBlob ? 'blob' : 'json',
  });
};

export default axiosInstance;
