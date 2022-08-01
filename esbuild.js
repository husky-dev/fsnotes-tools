const esbuild = require('esbuild');
const package = require('./package.json');

const cwd = process.cwd();
const srcPath = `${cwd}/src`;
const distPath = `${cwd}/dist`;

// Utils

const log = {
  trace: (...args) => console.log('[*]:', ...args),
  debug: (...args) => console.log('[-]:', ...args),
  info: (...args) => console.log('[+]:', ...args),
  err: (...args) => console.error(...args),
};

// Main

const run = async () => {
  log.info('bundle js');
  await esbuild.build({
    platform: 'node',
    target: 'node14',
    entryPoints: [`${srcPath}/index.ts`],
    outfile: `${distPath}/index.js`,
    bundle: true,
    sourcemap: false,
    minify: true,
    banner: {
      'js': '#!/usr/bin/env node',
    },
    loader: {
      '.html': 'text',
    },
    define: {
      VERSION: JSON.stringify(package.version),
      DESCRIPTION: JSON.stringify(package.description),
    },
    external: ['puppeteer']
  });
  log.info('bundle js done');
}

run().catch(err => {
  log.err(err);
  process.exit(1);
});
