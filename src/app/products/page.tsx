'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Product, Category } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const categories: Category[] = [
    'Все',
    'Классические',
    'Мясные',
    'Сырные',
    'Овощные',
    'Грибные',
    'Острые',
    'Морепродукты',
    'Детские',
    'Веганские',
    'Сладкие',
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchQuery])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    // Здесь можно добавить уведомление о добавлении в корзину
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем меню...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Pideh Armenia
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-900 hover:text-orange-500">
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-orange-100 flex items-center justify-center">
                <span className="text-6xl">🥟</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ингредиенты:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {product.price} ֏
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Товары не найдены</p>
            <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  )
}
