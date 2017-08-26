import path from 'path';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: path.join('src', 'store.ts'),
  plugins: [
    typescript()
  ],
  sourcemap: true,
  output: {
    exports: 'named',
    file: 'dist/repatch.js',
    name: 'Repatch',
    format: 'umd'
  }
}
