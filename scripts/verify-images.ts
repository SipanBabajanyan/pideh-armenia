import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyImages() {
  try {
    console.log('🔍 Проверяем доступность изображений...\n')

    const products = await prisma.product.findMany()
    const baseUrl = 'http://localhost:3002'
    
    let accessibleCount = 0
    let inaccessibleCount = 0

    for (const product of products) {
      const imageUrl = `${baseUrl}${product.image}`
      
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' })
        
        if (response.ok) {
          console.log(`✅ ${product.name} - ${product.image}`)
          accessibleCount++
        } else {
          console.log(`❌ ${product.name} - ${product.image} (HTTP ${response.status})`)
          inaccessibleCount++
        }
      } catch (error) {
        console.log(`❌ ${product.name} - ${product.image} (Ошибка: ${error})`)
        inaccessibleCount++
      }
    }

    console.log(`\n📈 Результаты проверки:`)
    console.log(`✅ Доступно: ${accessibleCount}`)
    console.log(`❌ Недоступно: ${inaccessibleCount}`)
    console.log(`📊 Всего товаров: ${products.length}`)

  } catch (error) {
    console.error('❌ Ошибка при проверке изображений:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
verifyImages()
