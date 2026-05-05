import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

// Variant configs — each maps to a different dashboard "mode"
const VARIANT_CONFIG = {
  world: {
    title: 'IITG Analysed',
    description: 'Real-time IIT Guwahati intelligence dashboard',
  },
  research: {
    title: 'IITG Research Monitor',
    description: 'Research publications, grants, and collaboration tracker',
  },
  placements: {
    title: 'IITG Placement Radar',
    description: 'Placement season stats, company visits, and offers',
  },
  events: {
    title: 'IITG Events',
    description: 'Campus events, seminars, and cultural fests',
  },
  infra: {
    title: 'IITG Infrastructure',
    description: 'Campus facility status and infrastructure map',
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const variant = VARIANT_CONFIG[mode as keyof typeof VARIANT_CONFIG] ?? VARIANT_CONFIG.world;

  const isDefaultVariant = mode === 'world';

  return {
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'shared'),
        '@config': resolve(__dirname, 'src/config'),
        '@types': resolve(__dirname, 'src/types'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@feeds': resolve(__dirname, 'src/feeds'),
        '@components': resolve(__dirname, 'src/components'),
      },
    },
    define: {
      __VARIANT__: JSON.stringify(mode),
      __APP_TITLE__: JSON.stringify(variant.title),
      __APP_DESCRIPTION__: JSON.stringify(variant.description),
      __REPO_URL__: JSON.stringify('https://github.com/Nihal1DS/IITG-analysed'),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL ?? 'http://localhost:3000',
          changeOrigin: true,
        },
        '/relay': {
          target: env.VITE_RELAY_URL ?? 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/relay/, ''),
        },
      },
    },
    base: env.VITE_BASE_PATH ?? '/',
    build: {
      outDir: isDefaultVariant ? 'dist' : `dist/${mode}`,
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks: {
            'map-engine': ['@deck.gl/core', '@deck.gl/layers', 'maplibre-gl'],
            'three': ['three', 'globe.gl'],
          },
        },
      },
    },
  };
});
