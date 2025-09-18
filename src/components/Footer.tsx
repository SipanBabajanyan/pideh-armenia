import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Pideh Armenia Logo" 
                width={120} 
                height={40}
                className="h-10 w-auto mr-3"
                style={{ width: "auto", height: "auto" }}
              />
              <h3 className="text-2xl font-bold text-orange-500">Pideh Armenia</h3>
            </div>
            <p className="text-gray-300 mb-4">
              🍟Fast food chain🍟 - Армянские пиде - новый вкус. Свежие, вкусные, быстрые!
              Традиционная форма с современными начинками. 15 уникальных вкусов для настоящих гурманов.
            </p>
            <div className="flex space-x-4">
              <a href="tel:+37495044888" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:info@pideh.am" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Меню</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Все товары
                </Link>
              </li>
              <li>
                <Link href="/products?category=Классические" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Классические
                </Link>
              </li>
              <li>
                <Link href="/products?category=Мясные" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Мясные
                </Link>
              </li>
              <li>
                <Link href="/products?category=Сырные" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Сырные
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:+37495044888" className="text-gray-300 hover:text-orange-500 transition-colors">
                  +374 95-044-888
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a href="mailto:info@pideh.am" className="text-gray-300 hover:text-orange-500 transition-colors">
                  info@pideh.am
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-300">Zoravar Andranik 151/2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-300">Yeznik Koghbatsi 83</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div className="text-gray-300">
                  <div>Пн-Вс: 10:00 - 22:00</div>
                  <div className="text-sm">Доставка: 11:00 - 21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Pideh Armenia. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
