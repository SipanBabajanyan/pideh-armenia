'use client'

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [comboProducts, setComboProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bannerProduct, setBannerProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Комбо')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const [addedToCartHits, setAddedToCartHits] = useState<Set<string>>(new Set())
  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const [productsResponse, featuredResponse, bannerResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/products/featured'),
        fetch('/api/products/banner')
      ])
      
      const productsData = await productsResponse.json()
      const featuredData = await featuredResponse.json()
      const bannerData = await bannerResponse.json()
      
      setProducts(productsData)
      setBannerProduct(bannerData) // Устанавливаем товар-баннер
      
      // Проверяем, что featuredData является массивом
      if (Array.isArray(featuredData)) {
        setFeaturedProducts(featuredData) // Показываем все товары-хиты
      } else {
        console.error('Featured products API returned non-array:', featuredData)
        setFeaturedProducts([])
      }
      
      // Фильтруем комбо товары для секции хитов
      const combos = productsData.filter((product: Product) => product.category === 'Комбо')
      setComboProducts(combos.slice(0, 4)) // Берем первые 4 комбо
    } catch (error) {
      console.error('Error fetching products:', error)
      setFeaturedProducts([])
      setBannerProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
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
  }

  const handleAddToCartHits = (product: Product) => {
    addItem(product, 1)
    setAddedToCartHits(prev => new Set(prev).add(product.id))
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setAddedToCartHits(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HIT':
        return { text: 'ХИТ ПРОДАЖ', color: 'bg-red-500' }
      case 'NEW':
        return { text: 'НОВИНКА', color: 'bg-green-500' }
      case 'CLASSIC':
        return { text: 'КЛАССИКА', color: 'bg-blue-500' }
      case 'BANNER':
        return { text: 'БАННЕР', color: 'bg-purple-500' }
      default:
        return { text: 'ПОПУЛЯРНОЕ', color: 'bg-orange-500' }
    }
  }

  const getFilteredProducts = () => {
    // Если есть поисковый запрос, ищем по всем товарам
    if (searchQuery.trim()) {
      return products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    // Если нет поискового запроса, показываем товары выбранной категории
    return products.filter(product => product.category === activeCategory)
  }

  const isPopularProduct = (product: Product) => {
    // Определяем популярные товары по названию или другим критериям
    const popularNames = ['Мясная пиде', 'Пепперони пиде', 'Классическая сырная пиде', 'Грибная пиде']
    return popularNames.some(name => product.name.toLowerCase().includes(name.toLowerCase()))
  }

  const categories = ['Комбо', 'Пиде', 'Напитки', 'Соусы', 'Снэк']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Отступ для fixed хедера */}
      <div className="md:hidden h-24"></div>
      <div className="hidden md:block h-24"></div>

      {/* Hero Section - Compact for Mobile */}
      <section className="relative bg-orange-500 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-200/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-yellow-300/30 rounded-full animate-pulse"></div>
        </div>
        
        {/* Mobile Compact Version */}
        <div className="md:hidden relative max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left content - compact */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight mb-2">
                <span className="block text-white">Армянские</span>
                <span className="block text-yellow-200">пиде</span>
              </h1>
              <p className="text-sm text-orange-100 mb-3">
                15 уникальных вкусов
              </p>
              <div className="flex gap-4 text-xs">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-200">15+</div>
                  <div className="text-orange-100">Вкусов</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-200">20</div>
                  <div className="text-orange-100">Минут</div>
                </div>
              </div>
            </div>
            
            {/* Right content - product showcase */}
            <div className="relative">
              {bannerProduct ? (
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                  <div className="relative w-28 h-28 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={bannerProduct.image} 
                      alt={bannerProduct.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div 
                      className="w-full h-full flex items-center justify-center text-3xl"
                      style={{ display: 'none' }}
                    >
                      🥟
                    </div>
                    
                    {/* Price badge - moved to bottom right */}
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-orange-800 px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      {bannerProduct.price} ֏
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold mb-1">{bannerProduct.name}</h3>
                  <p className="text-xs text-orange-100 mb-2">{bannerProduct.description}</p>
                  
                  <button
                    onClick={() => handleAddToCart(bannerProduct)}
                    className="bg-yellow-400 text-orange-800 px-3 py-1 rounded-lg font-bold text-xs hover:bg-yellow-300 transition-colors"
                  >
                    <ShoppingCart className="inline w-3 h-3 mr-1" />
                    Заказать
                  </button>
                </div>
              ) : (
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                  <div className="relative w-28 h-28 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🥟</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1">Армянские пиде</h3>
                  <p className="text-xs text-orange-100 mb-2">Вкусные и свежие</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Full Version */}
        <div className="hidden md:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Свежие пиде каждый день
              </div>
              
              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-white animate-slide-up">Армянские</span>
                <span className="block text-yellow-200 animate-slide-up-delay">пиде</span>
                <span className="block text-3xl md:text-4xl font-normal text-orange-100 mt-4 animate-fade-in-delay">
                  новый вкус
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-xl md:text-2xl text-orange-100 leading-relaxed max-w-lg animate-fade-in-delay-2">
                Традиционная форма с современными начинками. 
                <span className="font-semibold text-yellow-200"> 15 уникальных вкусов</span> для настоящих гурманов!
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8 animate-fade-in-delay-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-200">15+</div>
                  <div className="text-sm text-orange-100">Вкусов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-200">20</div>
                  <div className="text-sm text-orange-100">Минут</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-200">24/7</div>
                  <div className="text-sm text-orange-100">Доставка</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-4">
                <Link 
                  href="/products"
                  className="group bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-100 hover:scale-105 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                  Посмотреть меню
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/contact"
                  className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300 text-center backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center">
                    <Phone className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Связаться с нами
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Right content - Product showcase */}
            <div className="relative animate-fade-in-delay-5">
              {/* Main product card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl">
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-300 rounded-full animate-pulse"></div>
                
                {/* Product image */}
                <div className="relative w-72 h-72 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden group">
                  {bannerProduct ? (
                    <>
                      <img 
                        src={bannerProduct.image} 
                        alt={bannerProduct.name}
                        className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        className="w-full h-full flex items-center justify-center text-8xl"
                        style={{ display: 'none' }}
                      >
                        🥟
                      </div>
                      
                      {/* Price badge - moved to bottom right */}
                      <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-orange-800 px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                        {bannerProduct.price} ֏
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      🥟
                    </div>
                  )}
                </div>
                
                {bannerProduct ? (
                  <>
                    <h3 className="text-2xl font-bold mb-2">{bannerProduct.name}</h3>
                    <p className="text-orange-100 mb-4">{bannerProduct.description}</p>
                    
                    {/* Quick action */}
                    <button
                      onClick={() => handleAddToCart(bannerProduct)}
                      className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <ShoppingCart className="inline w-5 h-5 mr-2" />
                      Быстрый заказ
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-2">Армянские пиде</h3>
                    <p className="text-orange-100 mb-4">Вкусные и свежие</p>
                    
                    <Link 
                      href="/products"
                      className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 hover:scale-105 transition-all duration-300 shadow-lg inline-block"
                    >
                      <ShoppingCart className="inline w-5 h-5 mr-2" />
                      Посмотреть меню
                    </Link>
                  </>
                )}
              </div>
              
              {/* Floating mini cards */}
              <div className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🍕</span>
                </div>
                <div className="text-xs font-semibold">15+ вкусов</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float-delay">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🚚</span>
                </div>
                <div className="text-xs font-semibold">Быстрая доставка</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search Section */}
      <div className="md:hidden bg-white py-4 px-4 border-b border-gray-100">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск по меню..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base text-gray-900 placeholder-gray-600 bg-white transition-all duration-300 shadow-md hover:shadow-lg"
              />
            </div>
            <button 
              onClick={() => {
                // Если есть поисковый запрос, показываем результаты
                if (searchQuery.trim()) {
                  // Можно добавить дополнительную логику здесь
                  console.log('Поиск:', searchQuery)
                }
              }}
              className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Showcase Section - Moved up */}
      <section className="py-2 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-4">
            
            {/* Category tabs - Mobile 2 rows, Desktop single row */}
            <div className="mb-2">
              {/* Mobile - 2 rows with better design */}
              <div className="md:hidden">
                <div className="space-y-2">
                  {/* First row - Комбо и Пиде занимают весь ряд */}
                  <div className="grid grid-cols-2 gap-3">
                    {categories.slice(0, 2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                          activeCategory === category
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  {/* Second row - остальные категории */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.slice(2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                          activeCategory === category
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Desktop - single row */}
              <div className="hidden md:flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-600">Загружаем меню...</p>
              </div>
            </div>
          ) : getFilteredProducts().length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              {searchQuery.trim() ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    По запросу "{searchQuery}" ничего не найдено
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Поиск выполнен по всему меню. Попробуйте изменить поисковый запрос или выбрать категорию
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Очистить поиск
                    </button>
                    <button
                      onClick={() => setActiveCategory('Комбо')}
                      className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Показать комбо
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Товары в категории "{activeCategory}" скоро появятся
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Пока что посмотрите другие категории
                  </p>
                  <button
                    onClick={() => setActiveCategory('Комбо')}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Показать комбо
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {getFilteredProducts().map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    variant="compact"
                    addedToCart={addedToCart}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/products"
              className="group inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Посмотреть все меню</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Pide Showcase Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Попробуйте наши хиты
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Самые популярные и вкусные пиде, которые выбирают наши клиенты
            </p>
          </div>

          {/* Featured products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => {
                const badge = getStatusBadge(product.status)
                return (
                  <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-72 bg-orange-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        className="w-full h-full flex items-center justify-center text-8xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                        style={{ display: 'none' }}
                      >
                        🥟
                      </div>
                      
                      {/* Dynamic badge based on status */}
                      <div className={`absolute top-4 left-4 ${badge.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {badge.text}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-orange-500">{product.price} ֏</span>
                        </div>
                        <button
                          onClick={() => handleAddToCartHits(product)}
                          className={`w-40 h-14 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center overflow-hidden hover:scale-105 shadow-lg ${
                            addedToCartHits.has(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                          title="В корзину"
                        >
                          {addedToCartHits.has(product.id) ? (
                            '✓ В корзине'
                          ) : (
                            <span className="flex items-center">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Добавить
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              // Fallback if no featured products
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Товары-хиты скоро появятся!</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/products"
              className="group inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Посмотреть все вкусы</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы создали идеальное сочетание традиций и инноваций для вашего удовольствия
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fast delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Быстро</h3>
              <p className="text-gray-600 text-center mb-4">Готовим за 15-20 минут</p>
              <div className="text-center">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  ⚡ Молниеносно
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Доставка</h3>
              <p className="text-gray-600 text-center mb-4">По всему Еревану</p>
            <div className="text-center">
                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  🚚 30 мин
                </span>
              </div>
            </div>

            {/* Quality */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Качество</h3>
              <p className="text-gray-600 text-center mb-4">Только свежие ингредиенты</p>
            <div className="text-center">
                <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  🌟 Премиум
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Поддержка</h3>
              <p className="text-gray-600 text-center mb-4">+374 95-044-888</p>
            <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  💬 24/7
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonials Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Что говорят наши клиенты
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Более 1000 довольных клиентов уже попробовали наши пиде
            </p>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Невероятно вкусные пиде! Заказываю уже третий раз. Быстрая доставка и всегда свежие продукты. Рекомендую всем!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-lg">А</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Анна Меликян</h4>
                  <p className="text-sm text-gray-500">Постоянный клиент</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Лучшие пиде в Ереване! Качество на высоте, цены адекватные. Особенно нравится мясная пиде с соусом."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-500 font-bold text-lg">Д</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Давид Арутюнян</h4>
                  <p className="text-sm text-gray-500">Гурман</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Отличный сервис! Заказал комбо на двоих - все было готово за 20 минут. Пиде очень вкусные и сытные."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-500 font-bold text-lg">С</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Саргис Петросян</h4>
                  <p className="text-sm text-gray-500">Студент</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-600">Уникальных вкусов</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">20</div>
              <div className="text-gray-600">Минут доставка</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">4.9</div>
              <div className="text-gray-600">Рейтинг клиентов</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы попробовать?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Закажите сейчас и получите скидку 10% на первый заказ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Заказать сейчас
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Add bottom padding for mobile nav */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}