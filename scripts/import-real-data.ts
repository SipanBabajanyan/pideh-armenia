// Скрипт для импорта реальных данных в базу данных
import { PrismaClient } from '@prisma/client'
import { buyAmProducts, facebookProducts, companyInfo } from './collect-real-data'

const prisma = new PrismaClient()

async function importRealData() {
  try {
    console.log('🚀 Начинаем импорт реальных данных...')

    // Очищаем существующие данные
    console.log('🧹 Очищаем существующие данные...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Импортируем продукты с buy.am
    console.log('📦 Импортируем продукты с buy.am...')
    const buyAmData = buyAmProducts.filter(p => p.name && p.price > 0)
    
    for (const product of buyAmData) {
      if (product.name && product.price && product.price > 0) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description || '',
            price: product.price,
            image: product.image || '/images/default-product.jpg',
            category: product.category || 'Другие',
            ingredients: product.ingredients || [],
            isAvailable: product.isAvailable ?? true
          }
        })
        console.log(`✅ Добавлен продукт: ${product.name}`)
      }
    }

    // Импортируем продукты с Facebook
    console.log('📘 Импортируем продукты с Facebook...')
    const facebookData = facebookProducts.filter(p => p.name && p.price > 0)
    
    for (const product of facebookData) {
      if (product.name && product.price && product.price > 0) {
        // Проверяем, не существует ли уже такой продукт
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        })

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              name: product.name,
              description: product.description || '',
              price: product.price,
              image: product.image || '/images/default-product.jpg',
              category: product.category || 'Другие',
              ingredients: product.ingredients || [],
              isAvailable: product.isAvailable ?? true
            }
          })
          console.log(`✅ Добавлен продукт: ${product.name}`)
        } else {
          console.log(`⚠️  Продукт уже существует: ${product.name}`)
        }
      }
    }

    // Создаем файл с информацией о компании
    console.log('🏢 Создаем файл с информацией о компании...')
    const companyInfoContent = `// Информация о компании PIDEH Armenia
export const companyInfo = {
  name: '${companyInfo.name}',
  description: '${companyInfo.description}',
  address: '${companyInfo.address}',
  phone: '${companyInfo.phone}',
  email: '${companyInfo.email}',
  workingHours: '${companyInfo.workingHours}',
  socialMedia: {
    facebook: '${companyInfo.socialMedia.facebook}',
    instagram: '${companyInfo.socialMedia.instagram}',
    website: '${companyInfo.socialMedia.website}'
  }
}

export default companyInfo
`

    await import('fs').then(fs => 
      fs.promises.writeFile(
        '/Users/user/AI-Projects/pideh-armenia/src/constants/company.ts', 
        companyInfoContent
      )
    )

    console.log('✅ Информация о компании сохранена в src/constants/company.ts')

    // Подсчитываем импортированные продукты
    const totalProducts = await prisma.product.count()
    console.log(`🎉 Импорт завершен! Всего продуктов: ${totalProducts}`)

    // Выводим статистику по категориям
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    })

    console.log('\n📊 Статистика по категориям:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} продуктов`)
    })

  } catch (error) {
    console.error('❌ Ошибка при импорте данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем импорт
importRealData()
