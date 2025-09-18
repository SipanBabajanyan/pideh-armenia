'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  variant?: 'default' | 'compact'
}

const ProductCard = memo(({ product, onAddToCart, variant = 'default' }: ProductCardProps) => {
  const isCompact = variant === 'compact'

  return (
    <Link 
      href={`/products/${product.id}`}
      className={`block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-gray-100 ${
        isCompact ? 'rounded-lg shadow-md hover:shadow-xl' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative bg-orange-50 flex items-center justify-center overflow-hidden ${
        isCompact ? 'h-48 bg-gray-100' : 'h-56'
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
      <div className={isCompact ? 'p-4' : 'p-6'}>
        <h3 className={`font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 ${
          isCompact ? 'text-lg mb-2' : 'text-xl'
        }`}>
          {product.name}
        </h3>
        
        <p className={`text-gray-600 mb-4 line-clamp-2 ${
          isCompact ? 'text-sm' : 'text-sm'
        }`}>
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className={`font-bold text-orange-500 ${
              isCompact ? 'text-xl' : 'text-2xl'
            }`}>
              {product.price} ֏
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart(product)
            }}
            className={`bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center ${
              isCompact 
                ? 'px-12 py-3 rounded-lg hover:scale-100' 
                : 'px-12 py-3'
            }`}
            title="В корзину"
          >
            <span className="text-sm font-bold mr-1">+</span>
            <ShoppingCart className={isCompact ? 'h-4 w-4' : 'h-5 w-5'} />
          </button>
        </div>
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
