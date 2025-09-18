'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, ShoppingCart } from 'lucide-react'
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
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Наше меню
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите из {products.length} вкусных блюд. Свежие ингредиенты, быстрая доставка!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
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
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-orange-500 w-1 h-8 rounded-full"></div>
                  <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
                  <div className="flex-1 h-px bg-orange-200"></div>
                  <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                    {products.length} товаров
                  </span>
                </div>
                
                {/* Products Grid for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border border-gray-100"
                    >
                      {/* Image */}
                      <div className="relative h-56 bg-orange-50 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              console.error('Ошибка загрузки изображения:', product.image);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center bg-orange-100 text-8xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                          style={{ display: product.image ? 'none' : 'flex' }}
                        >
                          🥟
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.category}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
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
                              handleAddToCart(product)
                            }}
                            className="bg-orange-500 text-white px-12 py-3 rounded-xl hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                            title="В корзину"
                          >
                            <span className="text-sm font-bold mr-1">+</span>
                            <ShoppingCart className="h-5 w-5" />
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
                      className="bg-orange-500 text-white px-12 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                      title="В корзину"
                    >
                      <span className="text-sm font-bold mr-1">+</span>
                      <ShoppingCart className="h-4 w-4" />
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
