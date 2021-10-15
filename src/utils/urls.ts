import { config } from 'utils/config';

export const getImageUrl = (imageId: string): string => (
  `${config.BASE_URL}/ads/v1/campaign/resources/creatives/${imageId}?access_token=${config.ACCESS_TOKEN}`
);
