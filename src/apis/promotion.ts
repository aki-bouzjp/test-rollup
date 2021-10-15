import axiosInstance from './axios';
import { config } from 'utils/config';

export async function fetchImage(imageId: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = `ads/v1/campaign/resources/creatives/${imageId}?access_token=${config.ACCESS_TOKEN}`;
    return axiosInstance({ isBlob: true }).get(url).then((res: any) => {
      resolve(res.data);
    }).catch((error: Error) => {
      console.error(error);
      reject(error);
    });
  });
}
