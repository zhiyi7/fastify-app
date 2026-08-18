import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: {
        cjsReexport: true,
    },
    clean: true,
    target: 'node22',
    outDir: 'dist',
    sourcemap: false,
    outputOptions: {
        exports: 'named',
    },
    exports: {
        legacy: true,
    },
    outExtensions({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.mjs',
        };
    },
});
