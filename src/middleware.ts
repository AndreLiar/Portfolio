import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'fr', 'de'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Temporarily disable admin auth checks to allow Edge Runtime
  // TODO: Implement admin auth checks at page level instead of middleware
  // if (pathname.startsWith('/admin')) {
  //   // Admin auth will be handled at page level
  //   return NextResponse.next();
  // }

  // Handle internationalization for non-admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
      // Redirect if there is no locale
      request.nextUrl.pathname = `/${defaultLocale}${pathname}`
      return NextResponse.redirect(request.nextUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next/static, _next/image, favicon.ico) but include admin and auth routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
