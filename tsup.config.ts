import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'collections/index': 'src/collections/index.ts',
    'upload/index': 'src/upload/index.ts',
    'query/index': 'src/query/index.ts',
    'edit/index': 'src/edit/index.ts',
    'content/index': 'src/content/index.ts',
    'graph/index': 'src/graph/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  splitting: false,
});
