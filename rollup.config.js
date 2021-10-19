import pluginTypescript from '@rollup/plugin-typescript';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginPolyfill from 'rollup-plugin-polyfill-node';

import * as path from 'path';

const __DEV__ = process.env.NODE_ENV === 'development';

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
    // treeshake: false,
    preserveEntrySignatures: false,
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
      pluginNodeResolve({
        jsnext: true,
        preferBuiltins: true,
        browser: true
      })
    ]
  }
];

export default commonjs;
