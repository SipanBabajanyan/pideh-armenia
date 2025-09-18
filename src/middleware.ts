import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Проверяем, если пользователь пытается зайти в админку
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Проверяем роль пользователя
      if (req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Проверяем, если пользователь пытается зайти в профиль
    if (req.nextUrl.pathname.startsWith('/profile')) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Для админ-страниц проверяем роль
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        // Для профиля проверяем наличие токена
        if (req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        
        // Для остальных страниц разрешаем доступ
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']
}
