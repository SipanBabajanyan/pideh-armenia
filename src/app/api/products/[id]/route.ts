import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - получить товар по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
        isAvailable: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        ingredients: true,
        isAvailable: true,
        createdAt: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Добавляем кэширование на 10 минут для отдельных товаров
    const response = NextResponse.json(product)
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    
    return response
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
