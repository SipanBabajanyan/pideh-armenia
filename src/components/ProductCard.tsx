'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  variant?: 'default' | 'compact'
  addedToCart?: Set<string>
}

const ProductCard = memo(({ product, onAddToCart, variant = 'default', addedToCart }: ProductCardProps) => {
  const isCompact = variant === 'compact'
  const isAdded = addedToCart?.has(product.id) || false

  return (
    <Link 
      href={`/products/${product.id}`}
      className={`relative block bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group border border-gray-100 transform hover:-translate-y-2 ${
        isCompact ? 'rounded-2xl shadow-lg hover:shadow-xl' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fef7f0 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Floating Image Container */}
      <div className={`relative overflow-hidden ${
        isCompact ? 'h-40' : 'h-72'
      }`}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Main Image */}
        {product.image && product.image !== 'no-image' ? (
          <div className="relative h-full w-full">
            <img 
              src={product.image} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                console.error('Ошибка загрузки изображения:', product.image);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div 
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200 opacity-70 group-hover:opacity-90 transition-opacity duration-500 ${
              isCompact ? 'text-6xl' : 'text-8xl'
            }`}
          >
            🥟
          </div>
        )}
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Category Badge */}
          {!isCompact && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              {product.category}
            </div>
          )}
          
          {/* Special Badge */}
          {product.status === 'HIT' && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 transform group-hover:scale-110 transition-transform duration-300">
              <Star className="w-3 h-3" />
              ХИТ
            </div>
          )}
          
          {product.status === 'NEW' && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 transform group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-3 h-3" />
              НОВИНКА
            </div>
          )}
        </div>

        {/* Floating Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-full text-lg font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          {product.price} ֏
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Content Section */}
      <div className={`relative ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Product Name */}
        <h3 className={`font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 ${
          isCompact ? 'text-sm mb-3' : 'text-xl mb-4'
        }`}>
          {product.name}
        </h3>
        
        {/* Description for non-compact */}
        {!isCompact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {product.description}
          </p>
        )}
        
        {/* Action Section */}
        <div className={`relative ${isCompact ? 'space-y-3' : 'space-y-4'}`}>
          {isCompact ? (
            // Компактный вариант
            <div className="flex flex-col space-y-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart(product)
                }}
                className={`w-full h-12 rounded-2xl font-bold text-sm transition-all duration-500 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 hover:shadow-xl relative ${
                  isAdded
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
                title="В корзину"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {isAdded ? (
                  <span className="flex items-center relative z-10">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    В корзине
                  </span>
                ) : (
                  <span className="flex items-center relative z-10">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Добавить в корзину
                  </span>
                )}
              </button>
            </div>
          ) : (
            // Обычный вариант
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart(product)
                }}
                className={`px-6 h-14 rounded-2xl font-bold text-sm transition-all duration-500 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 hover:shadow-xl relative min-w-[140px] ${
                  isAdded
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
                title="В корзину"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {isAdded ? (
                  <span className="flex items-center relative z-10">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    В корзине
                  </span>
                ) : (
                  <span className="flex items-center relative z-10">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Добавить
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
