import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kiply.vercel.app';

  const routes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/leaderboard',
    '/report',
    '/profile',
    '/settings',
    '/games/math-pop',
    '/games/memory-match',
    '/games/word-hunt',
    '/games/color-touch',
    '/games/mole-math',
    '/games/sequence',
    '/games/shape-match',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/games') ? 0.9 : 0.7,
  }));
}
