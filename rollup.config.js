import pluginTypescript from '@rollup/plugin-typescript';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginPolyfill from 'rollup-plugin-polyfill-node';
import pluginReplace from 'rollup-plugin-replace';

import * as path from 'path';
import pkg from './package.json';

const __DEV__ = process.env.NODE_ENV === 'development';

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
];

const commonjs = [
  {
    input: 'src/core/index.ts',
    output: [
      {
        dir: 'lib/commonjs',
        name: 'MapboxPromoted',
        format: 'amd',
        // sourcemap: __DEV__ ? 'inline' : '',
        plugins: __DEV__ ? [] : [pluginTerser()],
      }
    ],
    plugins: [
      pluginPolyfill(),
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
      pluginNodeResolve({
        // jsnext: true,
        // preferBuiltins: true,
        browser: true
      })
    ],
    external
  }
];

export default commonjs;
