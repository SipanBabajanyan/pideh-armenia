import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function restoreOriginalProducts() {
  try {
    console.log('🔄 Восстанавливаем оригинальные товары...')
    
    // Читаем оригинальные данные
    const dataPath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    const originalData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    
    // Очищаем существующие товары
    await prisma.product.deleteMany({})
    console.log('✅ Существующие товары удалены')
    
    // Добавляем оригинальные товары
    for (const product of originalData) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          ingredients: product.ingredients || [],
          isAvailable: product.isAvailable !== false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
    
    console.log(`✅ Восстановлено ${originalData.length} оригинальных товаров`)
    
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
    console.error('❌ Ошибка при восстановлении товаров:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreOriginalProducts()
