'use strict';

const fs = require('fs');
const paths = require('./paths');

delete require.cache[require.resolve('./paths')];

// .env の読み込み
const defaultDotenvFile = paths.dotenv;
const stageDotenvFile = `${paths.dotenv}.${process.env.NODE_ENV}`;
const dotenvFile = fs.existsSync(stageDotenvFile) ? stageDotenvFile :
  fs.existsSync(defaultDotenvFile) ? defaultDotenvFile : null;
  
if (dotenvFile) {
  require('dotenv-expand')(
    require('dotenv').config({ path: dotenvFile })
  );
}

// .env から json で環境変数を生成する
// 環境変数は process.env に格納される
const getClientEnvironment = () => {
  let NODE_ENV = process.env.NODE_ENV;
  let PUBLIC_PATH = process.env.PUBLIC_PATH;
  let MAPBOX_BASE_URL = process.env.MAPBOX_BASE_URL;
  let MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  let MAPBOX_SOURCE_URL = process.env.MAPBOX_SOURCE_URL;
  let MAPBOX_TELEMETRY_URL = process.env.MAPBOX_TELEMETRY_URL;
  let MAPBOX_LAYER_SOURCE_ID = process.env.MAPBOX_LAYER_SOURCE_ID;
  const row = {
    NODE_ENV,
    PUBLIC_PATH,
    MAPBOX_BASE_URL,
    MAPBOX_ACCESS_TOKEN,
    MAPBOX_SOURCE_URL,
    MAPBOX_TELEMETRY_URL,
    MAPBOX_LAYER_SOURCE_ID,
  }
  const envStringified = Object.keys(row).reduce((env, key) => {
    env[key] = JSON.stringify(row[key]);
    return env;
  }, {});

  return { row, envStringified };
}

module.exports = getClientEnvironment;
