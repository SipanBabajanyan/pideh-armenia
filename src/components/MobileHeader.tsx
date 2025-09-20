'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Блокировка скролла когда меню открыто
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Функция для определения активной ссылки
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  // Навигационные ссылки
  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/products', label: 'Меню' },
    { href: '/about', label: 'О нас' },
    { href: '/contact', label: 'Контакты' },
  ]

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-[100] border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Mobile Logo - Centered */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="hover:opacity-80 transition-all duration-300 hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="Pideh Armenia Logo" 
                width={120} 
                height={40}
                className="h-10 w-auto"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Button - Simple and visible */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-900 hover:text-orange-500 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu - Simple dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-[100]">
            <nav className="py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200
                    ${isActive(link.href) ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500' : ''}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
