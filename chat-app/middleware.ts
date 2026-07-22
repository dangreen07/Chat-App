import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')
  
  // Public paths that don't require authentication
  const publicPaths = ['/sign-in', '/sign-up', '/api/auth']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // If no session token and not on a public path, redirect to sign-in
  if (!sessionToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // If has session token and on sign-in/sign-up, redirect to home
  if (sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
