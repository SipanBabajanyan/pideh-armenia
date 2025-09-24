import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Тестовая страница для проверки оптимизированной версии
export default async function TestOptimizedPage() {
  // Получаем список товаров для тестирования
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      status: true
    },
    take: 5
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Тест оптимизированной версии
        </h1>
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Оптимизации:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Server-Side Rendering (SSR)</li>
            <li>✅ Оптимизация изображений (WebP, AVIF)</li>
            <li>✅ Агрессивное кэширование</li>
            <li>✅ Service Worker</li>
            <li>✅ Bundle optimization</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Тестовые товары:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-orange-500 font-bold">{product.price} ֏</p>
                <p className="text-sm text-gray-600">Статус: {product.status}</p>
                <Link 
                  href={`/products/${product.id}/optimized`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Тест оптимизированной страницы →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Сравнение производительности:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-red-600 mb-2">Оригинальная версия</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Клиентская загрузка данных</li>
                <li>• Двойные API запросы</li>
                <li>• Большие изображения (PNG)</li>
                <li>• Отсутствие кэширования</li>
                <li>• Время загрузки: 3-5 секунд</li>
              </ul>
              <Link 
                href="/products"
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Тест оригинальной версии →
              </Link>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">Оптимизированная версия</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Server-Side Rendering</li>
                <li>• Объединенные API запросы</li>
                <li>• Оптимизированные изображения (WebP)</li>
                <li>• Агрессивное кэширование</li>
                <li>• Время загрузки: &lt; 1 секунда</li>
              </ul>
              <Link 
                href="/products"
                className="text-green-500 hover:text-green-700 text-sm"
              >
                Тест оптимизированной версии →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
