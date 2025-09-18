'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  ArrowLeft, 
  ChevronRight, 
  Calendar,
  User as UserIcon,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Truck,
  CheckSquare,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Plus,
  Download,
  Printer
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface OrderWithDetails extends Order {
  user: User
  items: (OrderItem & {
    product: {
      id: string
      name: string
      price: number
      image: string
    }
  })[]
  totalAmount: number
}

interface OrdersResponse {
  orders: OrderWithDetails[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusLabels = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтвержден',
  PREPARING: 'Готовится',
  READY: 'Готов',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен'
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // Проверяем права доступа
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Загружаем заказы
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (statusFilter) {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setPagination(data.pagination)
      
      // Рассчитываем статистику
      const totalRevenue = data.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const pendingOrders = data.orders.filter(order => order.status === 'PENDING').length
      const completedOrders = data.orders.filter(order => order.status === 'DELIVERED').length
      
      setStats({
        totalOrders: data.pagination.total,
        pendingOrders,
        completedOrders,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Открываем модальное окно с деталями заказа
  const openOrderDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Закрываем модальное окно
  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  // Изменяем статус заказа
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Обновляем локальное состояние
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      )

      // Обновляем выбранный заказ в модальном окне
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  // Получаем иконку для статуса
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />
      case 'PREPARING': return <Package className="h-4 w-4" />
      case 'READY': return <CheckSquare className="h-4 w-4" />
      case 'DELIVERED': return <Truck className="h-4 w-4" />
      case 'CANCELLED': return <X className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  // Фильтруем заказы по поисковому запросу
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      order.user.name.toLowerCase().includes(searchLower) ||
      order.user.email.toLowerCase().includes(searchLower) ||
      order.user.phone?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower)
    )
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад к админке
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={fetchOrders} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Обновить
            </Button>
            <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ожидают</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Завершены</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Выручка</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} ֏</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Поиск
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Поиск по имени, email, телефону или ID..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Статус
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Все статусы</option>
                <option value="PENDING">Ожидает</option>
                <option value="CONFIRMED">Подтвержден</option>
                <option value="PREPARING">Готовится</option>
                <option value="READY">Готов</option>
                <option value="DELIVERED">Доставлен</option>
                <option value="CANCELLED">Отменен</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Заказы ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Заказы не найдены</p>
                <p className="text-sm mt-2">
                  {searchTerm || statusFilter 
                    ? 'Попробуйте изменить фильтры поиска'
                    : 'Пока нет заказов'
                  }
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Order Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-orange-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Заказ #{order.id.slice(-8)}
                          </h3>
                          <Badge className={`${statusColors[order.status]} flex items-center gap-1`}>
                            {getStatusIcon(order.status)}
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-900">{order.user.name}</p>
                            <p>{order.user.email}</p>
                            {order.user.phone && <p>{order.user.phone}</p>}
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.totalAmount.toLocaleString()} ֏
                            </p>
                            <p>{order.paymentMethod}</p>
                            <p>{order.items.length} товар{order.items.length > 1 ? 'ов' : ''}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                            <p>
                              {new Date(order.createdAt).toLocaleTimeString('ru-RU', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => openOrderDetails(order)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Детали
                      </Button>
                      
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      >
                        <option value="PENDING">Ожидает</option>
                        <option value="CONFIRMED">Подтвержден</option>
                        <option value="PREPARING">Готовится</option>
                        <option value="READY">Готов</option>
                        <option value="DELIVERED">Доставлен</option>
                        <option value="CANCELLED">Отменен</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Пагинация */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Назад
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Страница {currentPage} из {pagination.pages}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
              className="flex items-center gap-2"
            >
              Вперед
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Модальное окно с деталями заказа */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  Заказ #{selectedOrder.id.slice(-8)}
                </h2>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Закрыть
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Статус и основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="font-medium">Статус</span>
                    </div>
                    <Badge className={statusColors[selectedOrder.status]}>
                      {statusLabels[selectedOrder.status]}
                    </Badge>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full mt-2 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="PENDING">Ожидает</option>
                      <option value="CONFIRMED">Подтвержден</option>
                      <option value="PREPARING">Готовится</option>
                      <option value="READY">Готов</option>
                      <option value="DELIVERED">Доставлен</option>
                      <option value="CANCELLED">Отменен</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Время заказа</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Сумма</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-600">
                      {selectedOrder.totalAmount.toLocaleString()} ֏
                    </div>
                    <div className="text-sm text-gray-500">{selectedOrder.paymentMethod}</div>
                  </div>
                </div>

                {/* Информация о клиенте */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-orange-500" />
                    Информация о клиенте
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Имя</p>
                      <p className="font-medium">{selectedOrder.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.user.email}</p>
                    </div>
                    {selectedOrder.user.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Телефон</p>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedOrder.user.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Информация о доставке */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    Информация о доставке
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Адрес доставки</p>
                      <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Время доставки</p>
                      <p className="font-medium">{selectedOrder.deliveryTime}</p>
                    </div>
                  </div>
                </div>

                {/* Товары в заказе */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Товары в заказе
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.product.price.toLocaleString()} ֏ × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">
                          {(item.product.price * item.quantity).toLocaleString()} ֏
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

