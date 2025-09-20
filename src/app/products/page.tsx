'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Search, Filter, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Product, Category } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const filterProducts = useCallback(() => {
    let filtered = products

    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (debouncedSearchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, debouncedSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [])

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (searchQuery !== debouncedSearchQuery) {
      setSearching(true)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    filterProducts()
  }, [filterProducts])

  // Группировка товаров по категориям
  const groupProductsByCategory = useCallback((products: Product[]) => {
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
  }, [])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1)
    setAddedToCart(prev => new Set(prev).add(product.id))
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }, [addItem])

  // Мемоизируем сгруппированные продукты
  const groupedProducts = useMemo(() => {
    return groupProductsByCategory(filteredProducts)
  }, [filteredProducts, groupProductsByCategory])

  // Компонент скелетона для карточки товара
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-12 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-wrap gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-12 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <ProductSkeleton key={i} />
            ))}
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
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                searching ? 'text-orange-500 animate-pulse' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-300"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}
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
            {groupedProducts.map(({ category, products }) => (
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      variant="default"
                      addedToCart={addedToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Показываем товары выбранной категории
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                variant="compact"
                addedToCart={addedToCart}
              />
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
