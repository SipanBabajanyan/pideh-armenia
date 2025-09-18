import { PrismaClient } from '@prisma/client'
import { sampleProducts } from '../src/constants/products'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очищаем существующие данные
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Очистили существующие данные')

  // Создаем товары
  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: productData
    })
    console.log(`✅ Создан товар: ${product.name}`)
  }

  // Создаем тестового пользователя
  const testUser = await prisma.user.create({
    data: {
      email: 'test@pideh-armenia.am',
      name: 'Тестовый Пользователь',
      phone: '+374 99 123 456',
      address: 'Ереван, ул. Абовяна, 1'
    }
  })
  console.log(`✅ Создан тестовый пользователь: ${testUser.email}`)

  // Создаем тестовый заказ
  const products = await prisma.product.findMany()
  const testOrder = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'PENDING',
      total: 2500,
      address: 'Ереван, ул. Абовяна, 1',
      phone: '+374 99 123 456',
      notes: 'Тестовый заказ',
      paymentMethod: 'idram',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price
          }
        ]
      }
    }
  })
  console.log(`✅ Создан тестовый заказ: ${testOrder.id}`)

  console.log('🎉 База данных успешно заполнена!')
  console.log(`📊 Статистика:`)
  console.log(`   - Товаров: ${products.length}`)
  console.log(`   - Пользователей: 1`)
  console.log(`   - Заказов: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
