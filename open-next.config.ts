import type { Config } from '@opennextjs/cloudflare';

const config: Config = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'direct',
    },
  },
  edgeExternals: ['node:crypto'],
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
  buildDir: '.open-next',
};

export default config;
