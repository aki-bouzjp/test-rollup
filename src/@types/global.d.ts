type Config = {
  BASE_URL: string;
  SOURCE_URL: string;
  ACCESS_TOKEN: string;
  MOBILE_MAX_WIDTH: number;
};
declare var renderApp: (config: Config) => void;
