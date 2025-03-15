import { NextResponse } from 'next/server';

// Middleware function for handling authentication and redirects
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  
  // Define authentication routes
  const authRoutes = ['/login', '/register'];
  
  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the requested path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect logic for protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect logged-in users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Export middleware function for Netlify compatibility
export default middleware;

// Matching paths configuration - be specific for better Netlify performance
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
}; 