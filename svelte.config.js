import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/prophets' : ''
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore missing static assets (favicon, images) during prerender
        if (path.endsWith('.svg') || path.endsWith('.png') || path.endsWith('.ico') || path.endsWith('.webp') || path.endsWith('.jpg')) {
          return;
        }
        throw new Error(message);
      }
    }
  }
};

export default config;
