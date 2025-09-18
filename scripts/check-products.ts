// Проверяем продукты в базе данных
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProducts() {
  try {
    console.log('🔍 Проверяем продукты в базе данных...\n')
    
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' }
    })
    
    console.log(`📊 Всего продуктов: ${products.length}\n`)
    
    // Группируем по категориям
    const categories = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    }, {} as Record<string, any[]>)
    
    // Показываем по категориям
    Object.entries(categories).forEach(([category, products]) => {
      console.log(`\n📁 ${category} (${products.length} продуктов):`)
      products.forEach(product => {
        const hasImage = product.image && product.image !== '' && !product.image.startsWith('http')
        const imageStatus = hasImage ? '✅' : '❌'
        console.log(`  ${imageStatus} ${product.name} - ${product.price} ֏ (${product.image || 'нет изображения'})`)
      })
    })
    
    // Статистика изображений
    const withImages = products.filter(p => p.image && p.image !== '' && !p.image.startsWith('http'))
    const withoutImages = products.filter(p => !p.image || p.image === '' || p.image.startsWith('http'))
    
    console.log(`\n📸 Статистика изображений:`)
    console.log(`  ✅ С изображениями: ${withImages.length}`)
    console.log(`  ❌ Без изображений: ${withoutImages.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
