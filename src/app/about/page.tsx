import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock, Users, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            О Pideh Armenia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создаем уникальные мини-пиццы в виде аджарских хачапури, 
            сочетая традиционные рецепты с современными вкусами.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Pideh Armenia родился из любви к традиционной грузинской кухне и желания 
                создать что-то уникальное для армянского рынка. Мы взяли классическую 
                форму аджарского хачапури и наполнили её начинками, которые любят 
                современные гурманы.
              </p>
              <p>
                Каждая наша "лодочка" готовится вручную с использованием только 
                свежих ингредиентов. Мы не используем замороженные полуфабрикаты 
                или консерванты - только натуральные продукты и традиционные 
                методы приготовления.
              </p>
              <p>
                За короткое время мы стали любимым местом для тех, кто ценит 
                качество, вкус и оригинальность. Наша миссия - привнести 
                в Ереван новые вкусы, сохраняя при этом уважение к традициям.
              </p>
            </div>
          </div>
          <div className="bg-orange-100 rounded-2xl p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-6xl">🥟</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Свежесть каждый день</h3>
            <p className="text-gray-600">
              Готовим только из свежих ингредиентов, 
              закупаемых каждое утро
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Любовь к делу</h3>
              <p className="text-gray-600">
                Каждое блюдо готовится с душой и вниманием к деталям
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Качество</h3>
              <p className="text-gray-600">
                Используем только лучшие ингредиенты и проверенные рецепты
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Скорость</h3>
              <p className="text-gray-600">
                Готовим быстро, но не в ущерб качеству и вкусу
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Сообщество</h3>
              <p className="text-gray-600">
                Создаем место, где собираются любители вкусной еды
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Главный повар</h3>
              <p className="text-gray-600">
                С 15-летним опытом работы в лучших ресторанах Еревана
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Менеджер</h3>
              <p className="text-gray-600">
                Обеспечивает отличный сервис и качество обслуживания
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Доставка</h3>
              <p className="text-gray-600">
                Быстрая и аккуратная доставка по всему Еревану
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-orange-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Pideh Armenia в цифрах</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-orange-100">Заказов в день</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-orange-100">Уникальных вкусов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-orange-100">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15-20</div>
              <div className="text-orange-100">Минут приготовления</div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
