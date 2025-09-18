import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Проверяем, если пользователь пытается зайти в админку
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Проверяем роль пользователя
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Проверяем, если пользователь пытается зайти в профиль
  if (request.nextUrl.pathname.startsWith('/profile')) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']
}
