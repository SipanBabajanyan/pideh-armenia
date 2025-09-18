'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ArrowLeft,
  Edit
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EditProfileModal from '@/components/EditProfileModal'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: Array<{
    product: {
      name: string
      image: string
    }
    quantity: number
    price: number
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    phone: null as string | null,
    address: null as string | null
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchOrders()
    fetchUserProfile()
  }, [session, status, router])

  useEffect(() => {
    if (session?.user) {
      setUserProfile(prev => ({
        ...prev,
        name: session.user?.name || null,
        email: session.user?.email || null
      }))
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(prev => ({
          ...prev,
          name: data.name,
          phone: data.phone,
          address: data.address
        }))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleSaveProfile = async (data: { name: string; phone: string; address: string }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setUserProfile(prev => ({
          ...prev,
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          address: updatedProfile.address
        }))
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Ожидает подтверждения', color: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'CONFIRMED':
        return { text: 'Подтвержден', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'PREPARING':
        return { text: 'Готовится', color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'READY':
        return { text: 'Готов к выдаче', color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'DELIVERED':
        return { text: 'Доставлен', color: 'text-green-600', bg: 'bg-green-100' }
      case 'CANCELLED':
        return { text: 'Отменен', color: 'text-red-600', bg: 'bg-red-100' }
      default:
        return { text: status, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'CONFIRMED':
      case 'PREPARING':
      case 'READY':
        return <Package className="h-4 w-4" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/"
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            На главную
          </Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <h1 className="text-3xl font-bold text-gray-900">Мой профиль</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Информация о профиле</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Имя</p>
                    <p className="font-medium text-gray-900">{userProfile.name || 'Не указано'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{userProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-medium text-gray-900">{userProfile.phone || 'Не указан'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Адрес</p>
                    <p className="font-medium text-gray-900">{userProfile.address || 'Не указан'}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <Edit className="h-5 w-5 mr-2" />
                Редактировать профиль
              </button>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">История заказов</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>У вас пока нет заказов</p>
                  <Link 
                    href="/products"
                    className="inline-block mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Сделать заказ
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">Заказ #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{order.total} ֏</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{statusInfo.text}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center overflow-hidden">
                                {item.product.image ? (
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-orange-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                <p className="text-sm text-gray-600">{item.quantity} шт. × {item.price} ֏</p>
                              </div>
                              <p className="font-semibold text-gray-900">{item.quantity * item.price} ֏</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={userProfile}
        onSave={handleSaveProfile}
      />
    </div>
  )
}
