import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Clock, MessageCircle, Star, Calendar, CreditCard } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Свяжитесь с нами
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            У вас есть вопросы? Хотите сделать заказ? Мы всегда рады помочь!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Телефон</h3>
            <p className="text-gray-600 mb-2">+374 95-044-888</p>
            <p className="text-sm text-gray-500">Пн-Вс: 10:00 - 22:00</p>
            <a 
              href="tel:+37495044888"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Позвонить
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
            <p className="text-gray-600 mb-2">info@pideh-armenia.am</p>
            <p className="text-sm text-gray-500">Ответим в течение 2 часов</p>
            <a 
              href="mailto:info@pideh-armenia.am"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Написать
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Адрес</h3>
            <p className="text-gray-600 mb-2">Yeznik Koghbatsi 83, Yerevan, Armenia 0002</p>
            <p className="text-sm text-gray-500">Доставка по всему городу</p>
            <button className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              На карте
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Время работы</h3>
            <p className="text-gray-600 mb-2">Пн-Вс: 10:00 - 22:00</p>
            <p className="text-sm text-gray-500">Доставка: 11:00 - 21:00</p>
          </div>
        </div>

        {/* Quick Order Section */}
        <div className="bg-orange-500 rounded-3xl p-12 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Быстрый заказ</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Просто позвоните нам или напишите в WhatsApp для быстрого заказа
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+37495044888"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Позвонить +374 95-044-888</span>
            </a>
            <a 
              href="https://wa.me/37495044888"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Часто задаваемые вопросы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Сколько времени готовится заказ?</h3>
              <p className="text-gray-600">Обычно 15-20 минут. В пиковые часы может быть немного дольше.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Есть ли доставка?</h3>
              <p className="text-gray-600">Да, мы доставляем по всему Еревану. Стоимость доставки уточняйте при заказе.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Можно ли заказать на завтра?</h3>
              <p className="text-gray-600">Конечно! Мы принимаем предварительные заказы на любой день недели.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Какие способы оплаты?</h3>
              <p className="text-gray-600">Наличные, карта, Idram, ArCa, Ameriabank - выбирайте удобный способ.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Есть ли скидки?</h3>
              <p className="text-gray-600">Да! При заказе от 5000 ֏ - скидка 10%, от 10000 ֏ - скидка 15%.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Как связаться с нами?</h3>
              <p className="text-gray-600">Звоните, пишите в WhatsApp или приходите к нам лично!</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Отзывы наших клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😋</span>
              </div>
              <p className="text-gray-600 mb-4">"Невероятно вкусно! Заказываю уже третий раз подряд. Быстрая доставка и отличное качество."</p>
              <p className="font-semibold text-gray-900">- Анна М.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-gray-600 mb-4">"Лучшие хачапури в Ереване! Острая хачапури просто бомба! Рекомендую всем."</p>
              <p className="font-semibold text-gray-900">- Давид К.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-gray-600 mb-4">"Отличный сервис и вкусная еда. Заказываем всей семьей каждые выходные!"</p>
              <p className="font-semibold text-gray-900">- Семья Петросян</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}