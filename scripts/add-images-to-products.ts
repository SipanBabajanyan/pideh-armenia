// Добавляем изображения для всех продуктов
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Маппинг изображений по категориям
const imageMapping = {
  'Комбо': [
    '/images/products/cmfpaig0f00007qqbr807vld2.jpg', // Комбо «Я один»
    '/images/products/cmfpaig0g00017qqbkxwf2syz.jpg', // Комбо «Мы вдвоем»
    '/images/products/cmfpaig0i00027qqbxaeab5ng.jpg', // Комбо «Мы голодны»
    '/images/products/cmfpaig0j00037qqbk8a0miac.jpg'  // Комбо «Мы очень голодны»
  ],
  'Пиде': [
    '/images/products/cmfpaig0f00007qqbr807vld2.jpg', // Основное изображение пиде
    '/images/products/cmfpaig0g00017qqbkxwf2syz.jpg', // Альтернативное
    '/images/products/cmfpaig0i00027qqbxaeab5ng.jpg', // Еще одно
    '/images/products/cmfpaig0j00037qqbk8a0miac.jpg'  // И еще одно
  ],
  'Снэк': [
    '/images/products/cmfpaig0f00007qqbr807vld2.jpg', // Используем основное изображение
    '/images/products/cmfpaig0g00017qqbkxwf2syz.jpg'
  ],
  'Соусы': [
    '/images/products/cmfpaig0f00007qqbr807vld2.jpg', // Используем основное изображение
    '/images/products/cmfpaig0g00017qqbkxwf2syz.jpg'
  ],
  'Освежающие напитки': [
    '/images/products/cmfpaig0f00007qqbr807vld2.jpg', // Используем основное изображение
    '/images/products/cmfpaig0g00017qqbkxwf2syz.jpg'
  ]
}

async function addImagesToProducts() {
  try {
    console.log('🖼️  Добавляем изображения для всех продуктов...\n')
    
    // Получаем все продукты
    const allProducts = await prisma.product.findMany()
    
    // Фильтруем продукты без изображений или с внешними ссылками
    const products = allProducts.filter(product => 
      !product.image || 
      product.image === '' || 
      product.image.startsWith('http')
    )
    
    console.log(`📦 Найдено ${products.length} продуктов без изображений`)
    
    let updatedCount = 0
    
    for (const product of products) {
      const categoryImages = imageMapping[product.category as keyof typeof imageMapping] || imageMapping['Пиде']
      
      // Выбираем изображение циклически
      const imageIndex = updatedCount % categoryImages.length
      const selectedImage = categoryImages[imageIndex]
      
      await prisma.product.update({
        where: { id: product.id },
        data: { image: selectedImage }
      })
      
      console.log(`✅ ${product.name} (${product.category}) → ${selectedImage}`)
      updatedCount++
    }
    
    console.log(`\n🎉 Обновлено ${updatedCount} продуктов с изображениями!`)
    
    // Проверяем результат
    const totalProducts = await prisma.product.count()
    const productsWithImages = await prisma.product.count({
      where: {
        AND: [
          { image: { not: '' } },
          { image: { not: null } },
          { image: { not: { startsWith: 'http' } } }
        ]
      }
    })
    
    console.log(`\n📊 Итоговая статистика:`)
    console.log(`  Всего продуктов: ${totalProducts}`)
    console.log(`  С изображениями: ${productsWithImages}`)
    console.log(`  Без изображений: ${totalProducts - productsWithImages}`)
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addImagesToProducts()