'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Phone, Menu, X, User, LogOut, Home, Utensils, Info, MessageCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'
import { useCurrentPath } from '@/hooks/useCurrentPath'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHydrated = useHydration()
  const { getTotalItems } = useCart()
  const { data: session, status } = useSession()
  const { activePage } = useCurrentPath()

  // Навигационные элементы с иконками
  const navigationItems = [
    { href: '/', label: 'Главная', icon: Home, key: 'home' },
    { href: '/products', label: 'Меню', icon: Utensils, key: 'products' },
    { href: '/about', label: 'О нас', icon: Info, key: 'about' },
    { href: '/contact', label: 'Контакты', icon: MessageCircle, key: 'contact' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Pideh Armenia Logo" 
              width={180} 
              height={60}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navigationItems.map(({ href, label, icon: Icon, key }) => {
              const isActive = activePage === key
              return (
                <Link
                  key={key}
                  href={href}
                  className={`
                    group relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-semibold">{label}</span>
                  
                  {/* Hover эффект */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              href="/cart" 
              className={`
                relative p-3 rounded-xl transition-all duration-300 group
                ${activePage === 'cart' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                }
              `}
            >
              <ShoppingCart className={`h-6 w-6 transition-transform duration-300 ${activePage === 'cart' ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isHydrated && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* User Profile */}
                <Link 
                  href="/profile" 
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group
                    ${activePage === 'profile' 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                    }
                  `}
                >
                  <User className={`h-5 w-5 transition-transform duration-300 ${activePage === 'profile' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:block font-medium">{session.user?.name}</span>
                </Link>
                
                {/* Admin Link */}
                {session.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
                      ${activePage === 'admin' 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }
                    `}
                  >
                    <span>Админ</span>
                  </Link>
                )}
                
                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-900 hover:text-orange-500 transition-colors"
                  title="Выйти"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                    ${activePage === 'login' 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                    }
                  `}
                >
                  <span>Войти</span>
                </Link>
                <Link 
                  href="/register" 
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                    ${activePage === 'register' 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                    }
                  `}
                >
                  <span>Регистрация</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-900 hover:text-orange-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 shadow-lg border border-orange-200">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map(({ href, label, icon: Icon, key }) => {
                  const isActive = activePage === key
                  return (
                    <Link
                      key={key}
                      href={href}
                      className={`
                        group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                        ${isActive 
                          ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-white/50'
                        }
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="text-sm font-semibold">{label}</span>
                    </Link>
                  )
                })}
              </nav>
              
              {/* Дополнительная информация в мобильном меню */}
              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-orange-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>+374 95-044-888</span>
                  </div>
                  <div className="w-px h-4 bg-orange-300"></div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>10:00-22:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
