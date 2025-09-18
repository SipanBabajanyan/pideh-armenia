'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Phone, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getTotalItems } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Pideh Armenia Logo" 
              width={120} 
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-900 hover:text-orange-500 transition-colors">
              Главная
            </Link>
            <Link href="/products" className="text-gray-900 hover:text-orange-500 transition-colors">
              Меню
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-orange-500 transition-colors">
              О нас
            </Link>
            <Link href="/contact" className="text-gray-900 hover:text-orange-500 transition-colors">
              Контакты
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-900 hover:text-orange-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Order Button */}
            <Link 
              href="/products"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Заказать
            </Link>

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
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                href="/products" 
                className="text-gray-900 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Меню
              </Link>
              <Link 
                href="/about" 
                className="text-gray-900 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-900 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
