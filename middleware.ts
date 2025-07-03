import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Only exclude static/image/favicon/public, NOT api
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 