import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Маппинг названий товаров к файлам изображений
const productImageMapping: Record<string, string> = {
  // Пиде
  'Пиде с бастурмой': 'Пиде с бастурмой.jpg',
  '2 мяса пиде': '2 мяса пиде.jpg',
  'Пиде с беконом': 'Пиде с беконом.jpg',
  'Пиде с говядиной': 'Пиде с говядиной.jpg',
  'Классическое сырное пиде': 'classic-chees.jpg',
  'Кавказский пиде': 'caucasus-cheese.jpg',
  'Куриные легкие пиде': 'Куриные легкие пиде.jpg',
  'Пиде Blue Pear': 'Пиде Blue Pear.jpg',
  'Овощное пиде': 'Овощное пиде.jpg',
  'Грибное пиде': 'Грибное пиде .jpg', // Обратите внимание на пробел в конце
  'Пиде с пхали': 'Пиде с пхали.jpg',
  'Шпинат пиде': 'Шпинат.jpg',
  'Пепперони пиде': 'Пепперони пиде.jpg',
  'Сладкий пиде': 'Сладкий пиде.jpg',
  'Пиде Хот Дог': 'Пиде Хот Дог.jpg',
  
  // Комбо
  'Комбо «Я один»': 'Комбо «Я один».jpg',
  'Комбо «Мы очень голодны»': 'Комбо «Мы очень голодны».jpg',
  'Комбо «Мы голодны»': 'Комбо «Мы голодны».jpg',
  'Комбо «Мы вдвоем»': 'Комбо «Мы вдвоем».jpg',
  
  // Напитки
  'Спрайт': 'cola-sprite-fanta.jpg',
  'Фанта': 'cola-sprite-fanta.jpg',
  'Кока-Кола': 'cola-sprite-fanta.jpg',
  'Сок (ассорти)': 'juice.jpg',
  'Минеральная вода': 'jur0000.jpg', // Предполагаем, что это вода
  'Тан': 'tan.jpg',
  
  // Снэк
  'Куриный попкорн': 'Куриный попкорн.jpg',
  'Картофель фри': 'Картофель фри.jpg',
  
  // Соусы
  'Сырный соус': 'classic-chees.jpg', // Используем сырное изображение
  'Коктейль соус': 'Cocktail-sauce-Pideh.jpg',
  'Барбекю соус': 'BBQ-sauce-Pideh.jpg',
  'Горчица': 'Mustard-sauce-Pideh.jpg',
  'Кетчуп': 'Ketchup-Pideh.jpg',
  'Майонез': 'Mayonnaise-Pideh.jpg',
  'Чесночный соус': 'classic-chees.jpg', // Используем общее изображение
}

async function fixProductImages() {
  try {
    console.log('🔧 Начинаем исправление путей к изображениям...\n')

    // Получаем все товары из базы данных
    const products = await prisma.product.findMany()
    console.log(`📊 Найдено товаров: ${products.length}\n`)

    let updatedCount = 0
    let notFoundCount = 0

    for (const product of products) {
      const imageFileName = productImageMapping[product.name]
      
      if (imageFileName) {
        const newImagePath = `/images/${imageFileName}`
        
        // Проверяем, существует ли файл
        const imagePath = path.join(process.cwd(), 'public', 'images', imageFileName)
        const fileExists = fs.existsSync(imagePath)
        
        if (fileExists) {
          // Обновляем путь к изображению в базе данных
          await prisma.product.update({
            where: { id: product.id },
            data: { image: newImagePath }
          })
          
          console.log(`✅ ${product.name} -> ${imageFileName}`)
          updatedCount++
        } else {
          console.log(`❌ Файл не найден: ${imageFileName} для товара: ${product.name}`)
          notFoundCount++
        }
      } else {
        console.log(`⚠️  Маппинг не найден для товара: ${product.name}`)
        notFoundCount++
      }
    }

    console.log(`\n📈 Результаты:`)
    console.log(`✅ Обновлено: ${updatedCount}`)
    console.log(`❌ Не найдено: ${notFoundCount}`)
    console.log(`📊 Всего товаров: ${products.length}`)

  } catch (error) {
    console.error('❌ Ошибка при обновлении изображений:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
fixProductImages()
