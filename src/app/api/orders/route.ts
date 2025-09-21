import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const { name, phone, address, paymentMethod, notes, items, total, deliveryTime } = await request.json()

    console.log('Creating order with data:', { 
      hasSession: !!session, 
      userId: session?.user?.id, 
      name, 
      phone, 
      address, 
      itemsCount: items?.length,
      total 
    })

    // Create order (supports both authenticated and guest users)
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null, // null for guest orders
        name: name || 'Guest Customer',
        status: 'PENDING',
        total,
        address,
        phone,
        notes,
        paymentMethod,
        deliveryTime,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    console.log('Order created successfully:', order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
