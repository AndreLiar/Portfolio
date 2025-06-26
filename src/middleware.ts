import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en'
});
 
export const config = {
  matcher: ['/', '/(de|fr|en)/:path*']
};