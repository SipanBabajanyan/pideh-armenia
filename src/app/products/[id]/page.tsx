'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Clock, MapPin, Phone, Heart, Share2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProductAndSimilar(params.id as string)
    }
  }, [params.id])

  const fetchProductAndSimilar = async (id: string) => {
    try {
      // Параллельная загрузка товара и всех товаров для похожих
      const [productResponse, similarResponse] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch('/api/products')
      ])

      if (productResponse.ok) {
        const productData = await productResponse.json()
        setProduct(productData)
      } else {
        router.push('/products')
        return
      }

      if (similarResponse.ok) {
        const products = await similarResponse.json()
        // Фильтруем похожие товары (исключаем текущий и берем первые 4)
        const similar = products
          .filter((p: Product) => p.id !== id)
          .slice(0, 4)
        setSimilarProducts(similar)
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }, [product, quantity, addItem])

  // Мемоизируем похожие товары
  const memoizedSimilarProducts = useMemo(() => {
    return similarProducts
  }, [similarProducts])

  // Компонент скелетона для страницы товара
  const ProductPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )

  if (loading) {
    return <ProductPageSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Товар не найден</h1>
            <p className="text-gray-600 mb-6">Возможно, товар был удален или не существует</p>
            <Link 
              href="/products" 
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">Главная</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-orange-500">Меню</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к каталогу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
              <div className="relative h-96 bg-gradient-to-br from-orange-50 to-orange-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                  className="w-full h-full flex items-center justify-center text-8xl opacity-60"
                  style={{ display: product.image ? 'none' : 'flex' }}
                >
                  🥟
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.category}
                  </div>
                  {product.category === 'Пиде' && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ХИТ
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional images placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl opacity-50">📷</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.9) • 127 отзывов</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-bold text-orange-500">{product.price} ֏</span>
                <span className="text-lg text-gray-500">за порцию</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ингредиенты:</h3>
              <div className="flex flex-wrap gap-3">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-orange-100 text-orange-800 text-sm rounded-full font-medium hover:bg-orange-200 transition-colors"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <label className="text-lg font-medium text-gray-900">Количество:</label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-6 py-3 min-w-[4rem] text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    addedToCart
                      ? 'bg-green-500 text-white scale-105 shadow-lg'
                      : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>
                    {addedToCart ? '✓ Добавлено в корзину!' : `Добавить в корзину - ${product.price * quantity} ֏`}
                  </span>
                </button>

                <button className="w-full border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300">
                  Купить сейчас
                </button>
              </div>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">15-20 мин</div>
                    <div className="text-sm text-gray-600">Время приготовления</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">30 мин</div>
                    <div className="text-sm text-gray-600">Доставка</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Поддержка</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Информация о товаре:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Категория: {product.category}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Время приготовления: 15-20 минут
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Вес: ~300г
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Только свежие ингредиенты
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Без консервантов
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {memoizedSimilarProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Похожие товары</h2>
              <Link 
                href="/products" 
                className="text-orange-500 hover:text-orange-600 font-semibold flex items-center"
              >
                Посмотреть все
                <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memoizedSimilarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.id}
                  href={`/products/${similarProduct.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-orange-50 flex items-center justify-center overflow-hidden">
                    {similarProduct.image ? (
                      <Image
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                      className="w-full h-full flex items-center justify-center text-6xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                      style={{ display: similarProduct.image ? 'none' : 'flex' }}
                    >
                      🥟
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {similarProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {similarProduct.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-500">
                        {similarProduct.price} ֏
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addItem(similarProduct, 1);
                        }}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
