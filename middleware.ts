import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rotas que não precisam de autenticação
  const publicPaths = ['/login'];
  
  const { pathname } = request.nextUrl;
  
  // Verificar se é uma rota pública
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Verificar se existe token de autenticação
  const token = request.cookies.get('authToken')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Se não há token e não é rota pública, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};