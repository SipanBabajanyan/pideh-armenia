'use client'

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [comboProducts, setComboProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      
      // Фильтруем комбо товары
      const combos = data.filter((product: Product) => product.category === 'Комбо')
      setComboProducts(combos.slice(0, 4)) // Берем первые 4 комбо
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Армянские пиде
                <span className="block text-yellow-200">новый вкус</span>
              </h2>
              <p className="text-xl mb-8 text-orange-100">
                Традиционная форма с современными начинками. 15 уникальных вкуса для настоящих гурманов!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products"
                  className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 text-center"
                >
                  Посмотреть меню
                </Link>
                <Link 
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-500 text-center"
                >
                  Связаться с нами
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="w-48 h-48 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/2-myasa-pide.jpg" 
                    alt="Армянские пиде"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ display: 'none' }}
                  >
                    🥟
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Свежие пиде</h3>
                <p className="text-orange-100">Готовим каждый день с любовью</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстро</h3>
              <p className="text-gray-600">Готовим за 15-20 минут</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Доставка</h3>
              <p className="text-gray-600">По всему Еревану</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заказ</h3>
              <p className="text-gray-600">+374 99 123 456</p>
            </div>
          </div>
        </div>
      </section>

      {/* Combo Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные комбо</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {comboProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-500">{product.price} ֏</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>В корзину</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link 
              href="/products"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Посмотреть все меню
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}