import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isChannelRoute = createRouteMatcher(['/channels(.*)']);
const isHomeRoute = createRouteMatcher(['/']);

export default clerkMiddleware(
  async (auth, request) => {
    const { userId } = await auth();
    if (isChannelRoute(request)) {
      await auth.protect();
    }
    if (userId && isHomeRoute(request)) {
      return NextResponse.redirect(new URL('/channels', request.url));
    }
  },
  {
    contentSecurityPolicy: {
      // strict: true,
      directives: {
        'connect-src': [
          process.env.NEXT_PUBLIC_API_URL!,
          process.env.NEXT_PUBLIC_API_URL_WS!,
        ],
      },
    },
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
