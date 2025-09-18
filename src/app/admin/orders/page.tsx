'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Filter, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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
        limit: '10'
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
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
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
    } catch (error) {
      console.error('Error updating order status:', error)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
              <p className="text-gray-600 mt-2">
                Всего заказов: {pagination.total}
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Назад в админку
              </Button>
            </Link>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Поиск по имени, email, телефону или ID заказа..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все статусы</SelectItem>
                  <SelectItem value="PENDING">Ожидает</SelectItem>
                  <SelectItem value="CONFIRMED">Подтвержден</SelectItem>
                  <SelectItem value="PREPARING">Готовится</SelectItem>
                  <SelectItem value="READY">Готов</SelectItem>
                  <SelectItem value="DELIVERED">Доставлен</SelectItem>
                  <SelectItem value="CANCELLED">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">Заказы не найдены</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm || statusFilter 
                    ? 'Попробуйте изменить фильтры поиска'
                    : 'Пока нет заказов'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Заказ #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Ожидает</SelectItem>
                          <SelectItem value="CONFIRMED">Подтвержден</SelectItem>
                          <SelectItem value="PREPARING">Готовится</SelectItem>
                          <SelectItem value="READY">Готов</SelectItem>
                          <SelectItem value="DELIVERED">Доставлен</SelectItem>
                          <SelectItem value="CANCELLED">Отменен</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Информация о клиенте */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Клиент</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Имя:</span> {order.user.name}</p>
                        <p><span className="font-medium">Email:</span> {order.user.email}</p>
                        {order.user.phone && (
                          <p><span className="font-medium">Телефон:</span> {order.user.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Информация о заказе */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Заказ</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Адрес:</span> {order.deliveryAddress}</p>
                        <p><span className="font-medium">Время доставки:</span> {order.deliveryTime}</p>
                        <p><span className="font-medium">Способ оплаты:</span> {order.paymentMethod}</p>
                        <p><span className="font-medium">Общая сумма:</span> 
                          <span className="font-bold text-orange-600 ml-1">
                            {order.totalAmount.toLocaleString()} ₽
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Товары в заказе */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Товары</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-500">Количество: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium text-sm">
                            {(item.product.price * item.quantity).toLocaleString()} ₽
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Пагинация */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-gray-600">
              Страница {currentPage} из {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
