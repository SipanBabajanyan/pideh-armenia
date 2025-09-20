'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
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
      className={`block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-gray-100 ${
        isCompact ? 'rounded-lg shadow-md hover:shadow-xl' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative bg-orange-50 flex items-center justify-center overflow-hidden ${
        isCompact ? 'h-32 bg-gray-100' : 'h-56'
      }`}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              console.error('Ошибка загрузки изображения:', product.image);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center bg-orange-100 opacity-60 group-hover:opacity-80 transition-opacity duration-300 ${
            isCompact ? 'text-6xl opacity-50 group-hover:opacity-70' : 'text-8xl'
          }`}
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          🥟
        </div>
        
        {/* Category Badge */}
        {!isCompact && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className={isCompact ? 'p-3' : 'p-6'}>
        <h3 className={`font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 ${
          isCompact ? 'text-sm mb-2' : 'text-xl mb-3'
        }`}>
          {product.name}
        </h3>
        
        {isCompact ? (
          // Компактный вариант - цена и кнопка на разных линиях
          <div className="space-y-2">
            <div>
              <span className="text-lg font-bold text-orange-500">
                {product.price} ֏
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product)
              }}
              className={`w-full h-10 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              title="В корзину"
            >
              {isAdded ? (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  В корзине
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить
                </span>
              )}
            </button>
          </div>
        ) : (
          // Обычный вариант - цена и кнопка на одной линии
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-orange-500">
                {product.price} ֏
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product)
              }}
              className={`w-32 h-12 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              title="В корзину"
            >
              {isAdded ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  В корзине
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
