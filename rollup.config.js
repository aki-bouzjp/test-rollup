import pluginTypescript from '@rollup/plugin-typescript';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import { terser as pluginTerser } from 'rollup-plugin-terser';

import * as path from 'path';
import pkg from './package.json';

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
];

const __DEV__ = process.env.NODE_ENV === 'development';
const __BROWSER__ = Boolean(process.env.BROWSER);
const __ESM__ = Boolean(process.env.ESM);
const __COMMONJS__ = Boolean(process.env.COMMONJS);

const browser = {
  input: 'src/core/index.ts',
  output: [
    {
      dir: 'lib/browser',
      name: 'MapboxPromoted',
      format: 'iife',
      sourcemap: __DEV__ ? 'inline' : '',
      plugins: __DEV__ ? [] : [pluginTerser()]
    }
  ],
  plugins: [
    pluginTypescript({
      tsconfig: 'tsconfig.json',
      module: 'esnext',
      declarationDir: 'lib/browser/@types'
    }),
    pluginCommonjs({
      extensions: ['.js', '.ts'],
    }),
    pluginBabel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '.babelrc.js'),
      exclude: /node_modules/,
    }),
    pluginNodeResolve()
  ]
};

const esm = {
  input: {
    index: 'src/core/index.ts',
    promotionPopup: 'src/core/promotionPopup.ts',
    promotionCard: 'src/core/promotionCard.ts',
    promotionSideCard: 'src/core/promotionSideCard.ts',
  },
  output: [
    {
      dir: 'lib/es',
      name: 'MapboxPromoted',
      format: 'es',
      sourcemap: __DEV__ ? 'inline' : '',
      plugins: __DEV__ ? [] : [pluginTerser()]
    }
  ],
  plugins: [
    pluginTypescript({
      tsconfig: 'tsconfig.json',
      module: 'esnext',
      declarationDir: 'lib/es/@types'
    }),
    pluginCommonjs({
      extensions: ['.js', '.ts'],
    }),
    pluginBabel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '.babelrc.js'),
      exclude: /node_modules/,
    }),
    pluginNodeResolve()
  ]
};

const commonjs = {
  input: {
    index: 'src/core/index.ts',
    promotionPopup: 'src/core/promotionPopup.ts',
    promotionCard: 'src/core/promotionCard.ts',
    promotionSideCard: 'src/core/promotionSideCard.ts',
  },
  output: [
    {
      dir: 'lib/commonjs',
      name: 'MapboxPromoted',
      format: 'amd',
      sourcemap: __DEV__ ? 'inline' : '',
      plugins: __DEV__ ? [] : [pluginTerser()]
    }
  ],
  plugins: [
    pluginTypescript({
      tsconfig: 'tsconfig.json',
      module: 'esnext',
      declarationDir: 'lib/commonjs/@types'
    }),
    pluginCommonjs({
      extensions: ['.js', '.ts'],
    }),
    pluginBabel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '.babelrc.js'),
      exclude: /node_modules/,
    }),
    pluginNodeResolve()
  ]
};

const configs = [];
__BROWSER__ && configs.push(browser);
__ESM__ && configs.push(esm);
__COMMONJS__ && configs.push(commonjs);

export default configs;
