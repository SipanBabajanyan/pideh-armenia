import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// POST /api/admin/products - создать новый товар (только для админов)
export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Проверяем права администратора
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Получаем данные из запроса
    const body = await request.json()
    const { name, description, price, category, image, ingredients, isAvailable = true } = body

    // Валидация обязательных полей
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category' },
        { status: 400 }
      )
    }

    // Валидация цены
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Валидация категории
    const validCategories = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Освежающие напитки']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: ' + validCategories.join(', ') },
        { status: 400 }
      )
    }

    // Создаем товар
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        image: image || '/images/products/default.jpg',
        ingredients: ingredients || [],
        isAvailable
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
