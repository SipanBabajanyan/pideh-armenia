import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProducts() {
  try {
    console.log('🔍 Проверяем продукты в базе данных...')
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true
      }
    })
    
    console.log(`📦 Найдено продуктов: ${products.length}`)
    
    if (products.length === 0) {
      console.log('❌ В базе данных нет продуктов!')
      return
    }
    
    console.log('📋 Список продуктов:')
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product.id}) - ${product.price} ֏ - ${product.isAvailable ? 'Доступен' : 'Недоступен'}`)
    })
    
    // Проверяем доступные продукты
    const availableProducts = products.filter(p => p.isAvailable)
    console.log(`\n✅ Доступных продуктов: ${availableProducts.length}`)
    
    if (availableProducts.length === 0) {
      console.log('⚠️ Внимание: Нет доступных продуктов!')
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке продуктов:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()