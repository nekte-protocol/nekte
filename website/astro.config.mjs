import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://nekte-protocol.github.io',
  integrations: [
    starlight({
      title: 'NEKTE Protocol',
      description:
        'Token-efficient agent-to-agent coordination protocol. Progressive discovery, zero-schema invocation, and budget-aware responses.',
      social: {
        github: 'https://github.com/nekte-protocol/nekte',
      },
      editLink: {
        baseUrl: 'https://github.com/nekte-protocol/nekte/edit/main/website/',
      },
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: '/og-image.png' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'Protocol',
          autogenerate: { directory: 'protocol' },
        },
        {
          label: 'Architecture',
          autogenerate: { directory: 'architecture' },
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'API Reference',
          autogenerate: { directory: 'api' },
        },
      ],
    }),
  ],
});
