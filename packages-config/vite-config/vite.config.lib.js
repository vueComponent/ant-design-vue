// @ts-nocheck

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * @type {import('./index.d.ts').GetUserConfig}
 */
export default dirname =>
  defineConfig(({ mode }) => {
    const pkg = JSON.parse(readFileSync(resolve(dirname, './package.json'), 'utf-8'));
    const isDev = mode === 'development';
    return {
      plugins: [
        dts({
          outDir: 'dist',
          compilerOptions: { declarationMap: isDev },
          include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts'],
          insertTypesEntry: true,
          skipDiagnostics: false,
        }),
      ],
      build: {
        cssCodeSplit: true,
        lib: {
          entry: {
            lib: resolve(dirname, 'src/index.ts'),
          },
          lib: {
            entry: {
              lib: resolve(dirname, 'src/index.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
          },
        },
        rollupOptions: {
          external: isDev
            ? id => {
                if (pkg.peerDependencies && id in pkg.peerDependencies) {
                  return true;
                }
                if (/^@(ant-design-vue)\//.test(id) || id === 'ant-design-vue') {
                  return true;
                }
                return false;
              }
            : pkg.peerDependencies && Object.keys(pkg.peerDependencies),
        },
        sourcemap: isDev ? 'inline' : undefined,
        minify: !isDev,
        emptyOutDir: !isDev,
        watch: process.argv.includes('--watch')
          ? {
              buildDelay: 300,
            }
          : null,
      },
      resolve: {
        alias: {
          '@': resolve(dirname, './src'),
        },
      },
    };
  });
