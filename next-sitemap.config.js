/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: false, // Single sitemap is sufficient
  changefreq: 'monthly',
  priority: 1.0,
  sitemapSize: 5000,
  
  // Transform function to add language-specific paths
  transform: async (config, path) => {
    // Default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' || path === '/en' ? 1.0 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${config.siteUrl}/en`,
          hreflang: 'en',
        },
        {
          href: `${config.siteUrl}/fr`, 
          hreflang: 'fr',
        },
        {
          href: `${config.siteUrl}/de`,
          hreflang: 'de',
        },
        {
          href: `${config.siteUrl}/en`,
          hreflang: 'x-default',
        },
      ],
    }
  },
  
  // Additional paths for multilingual support
  additionalPaths: async (config) => {
    const languages = ['en', 'fr', 'de']
    
    return languages.map(lang => ({
      loc: `/${lang}`,
      changefreq: 'monthly',
      priority: lang === 'en' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/en/',
      },
      {
        userAgent: '*', 
        allow: '/fr/',
      },
      {
        userAgent: '*',
        allow: '/de/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app'}/sitemap.xml`,
    ],
  },
}