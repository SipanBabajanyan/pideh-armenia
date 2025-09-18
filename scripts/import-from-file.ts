// Автоматический импортер данных из файла в базу данных
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

interface ProductData {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
  source: 'buy.am'
}

const prisma = new PrismaClient()

async function importFromFile() {
  try {
    console.log('🚀 Запускаем импорт данных из файла...')
    
    // Проверяем существование файла
    const jsonPath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Файл с данными не найден! Сначала запустите парсинг:')
      console.error('   npx tsx scripts/parse-buy-am.ts')
      process.exit(1)
    }
    
    // Читаем данные из файла
    console.log('📖 Читаем данные из файла...')
    const fileContent = fs.readFileSync(jsonPath, 'utf8')
    const products: ProductData[] = JSON.parse(fileContent)
    
    console.log(`📦 Найдено ${products.length} продуктов в файле`)
    
    // Очищаем существующие данные
    console.log('🧹 Очищаем существующие данные...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    
    // Импортируем продукты
    console.log('📥 Импортируем продукты в базу данных...')
    
    let importedCount = 0
    let errorCount = 0
    
    for (const product of products) {
      try {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            ingredients: product.ingredients,
            isAvailable: product.isAvailable
          }
        })
        importedCount++
        console.log(`✅ Импортирован: ${product.name}`)
      } catch (error) {
        errorCount++
        console.error(`❌ Ошибка при импорте ${product.name}:`, error)
      }
    }
    
    // Создаем папку для изображений
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
      console.log('📁 Создана папка для изображений')
    }
    
    // Скачиваем изображения
    console.log('🖼️  Скачиваем изображения...')
    const imageDownloader = await import('./download-images')
    await imageDownloader.downloadProductImages()
    
    // Статистика
    console.log('\n📊 Статистика импорта:')
    console.log(`  ✅ Успешно импортировано: ${importedCount} продуктов`)
    console.log(`  ❌ Ошибок: ${errorCount}`)
    
    // Статистика по категориям
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true }
    })
    
    console.log('\n📋 Продукты по категориям:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} продуктов`)
    })
    
    // Общая статистика
    const totalProducts = await prisma.product.count()
    const avgPrice = await prisma.product.aggregate({
      _avg: { price: true }
    })
    
    console.log(`\n💰 Общая статистика:`)
    console.log(`  Всего продуктов: ${totalProducts}`)
    console.log(`  Средняя цена: ${Math.round(avgPrice._avg.price || 0)} драмов`)
    
    console.log('\n🎉 Импорт завершен успешно!')
    
  } catch (error) {
    console.error('❌ Критическая ошибка при импорте:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем импорт
importFromFile()
