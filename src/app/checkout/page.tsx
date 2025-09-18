'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, CreditCard, Phone, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: '',
    paymentMethod: 'cash',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен'
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен'
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Выберите время доставки'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would normally send the order to your API
      console.log('Order data:', {
        ...formData,
        items: items,
        total: getTotalPrice()
      })
      
      // Clear cart and redirect to success page
      clearCart()
      router.push('/order-success')
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/cart"
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад к корзине
          </Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <h1 className="text-3xl font-bold text-gray-900">Оформление заказа</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Данные для доставки</h2>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Имя *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Введите ваше имя"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="+374 99 123 456"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Адрес доставки *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Укажите полный адрес доставки"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Время доставки *
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.deliveryTime ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Выберите время</option>
                      <option value="asap">Как можно скорее (20-30 мин)</option>
                      <option value="11:00-12:00">11:00 - 12:00</option>
                      <option value="12:00-13:00">12:00 - 13:00</option>
                      <option value="13:00-14:00">13:00 - 14:00</option>
                      <option value="14:00-15:00">14:00 - 15:00</option>
                      <option value="15:00-16:00">15:00 - 16:00</option>
                      <option value="16:00-17:00">16:00 - 17:00</option>
                      <option value="17:00-18:00">17:00 - 18:00</option>
                      <option value="18:00-19:00">18:00 - 19:00</option>
                      <option value="19:00-20:00">19:00 - 20:00</option>
                      <option value="20:00-21:00">20:00 - 21:00</option>
                    </select>
                    {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <CreditCard className="inline h-4 w-4 mr-1" />
                      Способ оплаты *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Наличные при доставке</div>
                          <div className="text-sm text-gray-600">Оплата курьеру наличными</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">Карта курьеру</div>
                          <div className="text-sm text-gray-600">Оплата картой через терминал курьера</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Комментарий к заказу
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      placeholder="Дополнительные пожелания к заказу..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Ваш заказ</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-600">{item.quantity} шт.</div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {item.product.price * item.quantity} ֏
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Итого</span>
                      <span>{getTotalPrice()} ֏</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Доставка бесплатно
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Оформляем заказ...' : 'Подтвердить заказ'}
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Нажимая "Подтвердить заказ", вы соглашаетесь с условиями доставки
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  )
}
