import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const locales = ['en', 'fr', 'de'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes - require authentication and admin role
  if (pathname.startsWith('/admin')) {
    try {
      const response = NextResponse.next()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              )
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        // Redirect to unauthorized page if not admin
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return response;
    } catch (error) {
      // If there's an error checking auth, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Handle auth routes - redirect if already logged in
  if (pathname.startsWith('/auth') && !pathname.includes('/logout')) {
    try {
      const response = NextResponse.next()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              )
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        return NextResponse.redirect(new URL('/admin/blog', request.url));
      }

      return response;
    } catch (error) {
      // Continue to auth page if there's an error
    }
  }

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
