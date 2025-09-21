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
      className={`relative block bg-white rounded-3xl shadow-2xl overflow-visible hover:shadow-3xl hover:scale-105 transition-all duration-700 cursor-pointer group border-0 transform hover:-translate-y-3 ${
        isCompact ? 'rounded-2xl shadow-xl hover:shadow-2xl' : ''
      }`}
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* 3D Product Container - No top border */}
      <div className={`relative overflow-visible ${
        isCompact ? 'h-48' : 'h-80'
      }`}>
        {/* Background Gradient - Removed dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* 3D Floating Product - No top border */}
        {product.image && product.image !== 'no-image' ? (
          <div className="relative w-full h-full">
            {/* 3D Product Image with floating effect */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+3rem)] h-[calc(100%+3rem)]">
              {/* 3D Shadow Layer - Lightened shadow */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-200/20 to-gray-300/15 rounded-3xl blur-lg transform translate-y-4 translate-x-2 group-hover:translate-y-6 group-hover:translate-x-3 transition-all duration-700"
                style={{
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Main 3D Product Image */}
              <img 
                src={product.image} 
                alt={product.name}
                className="relative w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-700 ease-out"
                style={{
                  filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 20px rgba(255, 107, 53, 0.2))',
                  transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                }}
                loading="lazy"
                onError={(e) => {
                  console.error('Ошибка загрузки изображения:', product.image);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              
              {/* 3D Highlight Effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                }}
              />
            </div>
          </div>
        ) : (
          <div 
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+3rem)] h-[calc(100%+3rem)] flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200 opacity-70 group-hover:opacity-90 transition-opacity duration-500 rounded-3xl shadow-2xl ${
              isCompact ? 'text-6xl' : 'text-8xl'
            }`}
            style={{
              filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))',
              transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
            }}
          >
            🥟
          </div>
        )}
        
        {/* 3D Floating Elements - Adjusted for 3D product */}
        <div className="absolute top-12 left-4 flex flex-col gap-2 z-20">
          {/* 3D Category Badge */}
          {!isCompact && (
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
              style={{
                boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {product.category}
            </div>
          )}
          
          {/* 3D Special Badge */}
          {product.status === 'HIT' && (
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
              style={{
                boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Star className="w-3 h-3" />
              ХИТ
            </div>
          )}
          
          {product.status === 'NEW' && (
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
              style={{
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Zap className="w-3 h-3" />
              НОВИНКА
            </div>
          )}
        </div>

        {/* 3D Floating Price Badge */}
        <div 
          className="absolute top-12 right-4 bg-white/95 backdrop-blur-md text-orange-600 px-4 py-2 rounded-2xl text-lg font-bold shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 z-20"
          style={{
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
          }}
        >
          {product.price} ֏
        </div>

        {/* Bottom Gradient Overlay - Removed black overlay */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
      </div>
      
      {/* 3D Content Section - Adjusted for 3D product */}
      <div className={`relative ${isCompact ? 'p-4 pt-12' : 'p-6 pt-16'}`}>
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
                className={`w-full h-12 rounded-2xl font-bold text-sm transition-all duration-500 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-105 hover:shadow-3xl relative ${
                  isAdded
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
                style={{
                  boxShadow: isAdded 
                    ? '0 15px 35px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    : '0 15px 35px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                title="В корзину"
              >
                {/* 3D Button Background Animation */}
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
                className={`px-6 h-14 rounded-2xl font-bold text-sm transition-all duration-500 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-105 hover:shadow-3xl relative min-w-[140px] ${
                  isAdded
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
                style={{
                  boxShadow: isAdded 
                    ? '0 15px 35px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    : '0 15px 35px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                title="В корзину"
              >
                {/* 3D Button Background Animation */}
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

      {/* 3D Floating Decorative Elements */}
      <div 
        className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
        style={{
          boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
          filter: 'blur(1px)',
        }}
      />
      <div 
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
        style={{
          boxShadow: '0 10px 25px rgba(255, 193, 7, 0.3)',
          filter: 'blur(1px)',
        }}
      />
      <div 
        className="absolute top-1/2 -left-4 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125"
        style={{
          boxShadow: '0 5px 15px rgba(236, 72, 153, 0.2)',
          filter: 'blur(0.5px)',
        }}
      />
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
