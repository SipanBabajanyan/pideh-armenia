import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Получаем статистику
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      completedOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          total: true
        }
      }),
      prisma.order.count({
        where: {
          status: 'PENDING'
        }
      }),
      prisma.order.count({
        where: {
          status: 'DELIVERED'
        }
      })
    ])

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      completedOrders
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
