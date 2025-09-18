import { PrismaClient } from '@prisma/client'
import { sampleProducts } from '../src/constants/products'

const prisma = new PrismaClient()

async function updateProducts() {
  try {
    console.log('🔄 Обновляем товары в базе данных...')
    
    // Очищаем существующие товары
    await prisma.product.deleteMany({})
    console.log('✅ Существующие товары удалены')
    
    // Добавляем новые товары
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: {
          ...product,
          ingredients: product.ingredients || []
        }
      })
    }
    
    console.log(`✅ Добавлено ${sampleProducts.length} товаров`)
    
    // Показываем статистику по категориям
    const stats = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })
    
    console.log('\n📊 Статистика по категориям:')
    stats.forEach(stat => {
      console.log(`  ${stat.category}: ${stat._count.category} товаров`)
    })
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении товаров:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProducts()
