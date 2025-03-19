export default async function sitemap() {
  const baseUrl = 'https://grokade.com';
  
  // Core pages
  const routes = [
    '',
    '/about',
    '/rankings',
    '/competitions',
    '/talent',
    '/developers',
    '/roadmap',
    '/login',
    '/register',
    '/newsletter',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Add dynamic routes here when you have access to database
  // For example, games pages
  // const games = await fetchGames();
  // const gameRoutes = games.map(game => ({
  //   url: `${baseUrl}/game/${game.slug}`,
  //   lastModified: new Date(game.updatedAt),
  //   changeFrequency: 'daily',
  //   priority: 0.7,
  // }));

  return [
    ...routes,
    // ...gameRoutes, // Uncomment when implementing dynamic routes
  ];
} 