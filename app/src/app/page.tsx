import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Phone, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">Pideh Armenia</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-orange-500">Главная</Link>
              <Link href="/products" className="text-gray-900 hover:text-orange-500">Меню</Link>
              <Link href="/about" className="text-gray-900 hover:text-orange-500">О нас</Link>
              <Link href="/contact" className="text-gray-900 hover:text-orange-500">Контакты</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-900 hover:text-orange-500">
                <ShoppingCart className="h-6 w-6" />
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                Заказать
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Мини-пиццы в виде
                <span className="block text-yellow-200">аджарских хачапури</span>
              </h2>
              <p className="text-xl mb-8 text-orange-100">
                Лодочки с начинкой как у пиццы. 15 уникальных вкусов для настоящих гурманов!
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
                <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🥟</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Свежие хачапури</h3>
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

      {/* Popular Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные хачапури</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Классическая", price: "2500", image: "🥟" },
              { name: "Мясная", price: "3200", image: "🥩" },
              { name: "Сырная", price: "2800", image: "🧀" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-orange-100 flex items-center justify-center">
                  <span className="text-6xl">{item.image}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.name} Хачапури</h3>
                  <p className="text-gray-600 mb-4">Вкусная начинка в хрустящем тесте</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">{item.price} ֏</span>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/products"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Посмотреть все меню
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-orange-500 mb-4">Pideh Armenia</h3>
              <p className="text-gray-300 mb-4">
                Мини-пиццы в виде аджарских хачапури. Свежие, вкусные, быстрые!
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <p className="text-gray-300 mb-2">+374 99 123 456</p>
              <p className="text-gray-300 mb-2">info@pideh-armenia.am</p>
              <p className="text-gray-300">Ереван, Армения</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Время работы</h4>
              <p className="text-gray-300 mb-2">Пн-Вс: 10:00 - 22:00</p>
              <p className="text-gray-300">Доставка: 11:00 - 21:00</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Pideh Armenia. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}