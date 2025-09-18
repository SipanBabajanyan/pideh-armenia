import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            У вас есть вопросы? Хотите сделать заказ? Мы всегда рады помочь!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Контактная информация</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Телефон</h3>
                    <p className="text-gray-600">+374 99 123 456</p>
                    <p className="text-sm text-gray-500">Пн-Вс: 10:00 - 22:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@pideh-armenia.am</p>
                    <p className="text-sm text-gray-500">Ответим в течение 2 часов</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Адрес</h3>
                    <p className="text-gray-600">Ереван, Армения</p>
                    <p className="text-sm text-gray-500">Доставка по всему городу</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Время работы</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Пн-Вс: 10:00 - 22:00</p>
                      <p className="text-sm text-gray-500">Доставка: 11:00 - 21:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Order */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Быстрый заказ</h3>
              <p className="text-gray-600 mb-4">
                Просто позвоните нам или напишите в WhatsApp для быстрого заказа
              </p>
              <div className="space-y-3">
                <a 
                  href="tel:+37499123456"
                  className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Позвонить +374 99 123 456
                </a>
                <a 
                  href="https://wa.me/37499123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Часто задаваемые вопросы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Сколько времени готовится заказ?</h3>
              <p className="text-gray-600">Обычно 15-20 минут. В пиковые часы может быть немного дольше.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Есть ли доставка?</h3>
              <p className="text-gray-600">Да, мы доставляем по всему Еревану. Стоимость доставки уточняйте при заказе.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Можно ли заказать на завтра?</h3>
              <p className="text-gray-600">Конечно! Мы принимаем предварительные заказы на любой день недели.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Какие способы оплаты?</h3>
              <p className="text-gray-600">Наличные, карта, Idram, ArCa, Ameriabank - выбирайте удобный способ.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
