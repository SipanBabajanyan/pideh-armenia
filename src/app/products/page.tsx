'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Product, Category } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const categories: Category[] = [
    'Все',
    'Комбо',
    'Пиде',
    'Снэк',
    'Соусы',
    'Освежающие напитки',
  ]

  // Порядок категорий для сортировки
  const categoryOrder = ['Комбо', 'Пиде', 'Снэк', 'Соусы', 'Освежающие напитки']

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

  // Группировка товаров по категориям
  const groupProductsByCategory = (products: Product[]) => {
    const grouped: Record<string, Product[]> = {}
    
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = []
      }
      grouped[product.category].push(product)
    })

    // Сортируем категории в нужном порядке
    const sortedCategories = categoryOrder.filter(cat => grouped[cat])
    
    return sortedCategories.map(category => ({
      category,
      products: grouped[category]
    }))
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    // Здесь можно добавить уведомление о добавлении в корзину
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Загружаем меню...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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

        {/* Products by Categories */}
        {selectedCategory === 'Все' ? (
          // Показываем все категории с заголовками
          <div className="space-y-12">
            {groupProductsByCategory(filteredProducts).map(({ category, products }) => (
              <div key={category} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                </div>
                
                {/* Products Grid for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.error('Ошибка загрузки изображения:', product.image);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center bg-orange-100 text-6xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                          style={{ display: product.image ? 'none' : 'flex' }}
                        >
                          🥟
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-orange-500">
                            {product.price} ֏
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                          >
                            В корзину
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Показываем товары выбранной категории
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Ошибка загрузки изображения:', product.image);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center bg-orange-100 text-6xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{ display: product.image ? 'none' : 'flex' }}
                  >
                    🥟
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-orange-500">
                      {product.price} ֏
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Товары не найдены</p>
            <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
