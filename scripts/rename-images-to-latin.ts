import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Функция для транслитерации кириллицы в латиницу
function transliterate(text: string): string {
  const cyrillic = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
  const latin = 'abvgdeezhziyklmnoprstufhccsssyyeyuya'
  
  let result = text.toLowerCase()
  
  // Заменяем кириллические символы
  for (let i = 0; i < cyrillic.length; i++) {
    result = result.replace(new RegExp(cyrillic[i], 'g'), latin[i])
  }
  
  // Заменяем специальные символы и пробелы
  result = result
    .replace(/[«»""]/g, '') // Убираем кавычки
    .replace(/\s+/g, '-') // Пробелы в дефисы
    .replace(/[^\w\-\.]/g, '') // Убираем все кроме букв, цифр, дефисов и точек
    .replace(/-+/g, '-') // Множественные дефисы в один
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
  
  return result
}

// Маппинг кириллических названий на латинские
const fileMapping: Record<string, string> = {
  '2 мяса пиде.jpg': '2-myasa-pide.jpg',
  'Грибное пиде .jpg': 'gribnoe-pide.jpg', // Убираем пробел в конце
  'Картофель фри.jpg': 'kartofel-fri.jpg',
  'Комбо «Мы вдвоем».jpg': 'kombo-my-vdvoyom.jpg',
  'Комбо «Мы голодны».jpg': 'kombo-my-golodny.jpg',
  'Комбо «Мы очень голодны».jpg': 'kombo-my-ochen-golodny.jpg',
  'Комбо «Я один».jpg': 'kombo-ya-odin.jpg',
  'Куриные легкие пиде.jpg': 'kurinye-legkie-pide.jpg',
  'Куриный попкорн.jpg': 'kurinyy-popkorn.jpg',
  'Овощное пиде.jpg': 'ovoshchnoe-pide.jpg',
  'Пепперони пиде.jpg': 'pepperoni-pide.jpg',
  'Пиде Blue Pear.jpg': 'pide-blue-pear.jpg',
  'Пиде Хот Дог.jpg': 'pide-hot-dog.jpg',
  'Пиде с бастурмой.jpg': 'pide-s-basturmoj.jpg',
  'Пиде с беконом.jpg': 'pide-s-bekonom.jpg',
  'Пиде с говядиной.jpg': 'pide-s-govyadinoj.jpg',
  'Пиде с пхали.jpg': 'pide-s-phali.jpg',
  'Сладкий пиде.jpg': 'sladkiy-pide.jpg',
  'Шпинат.jpg': 'shpinat.jpg',
}

async function renameImagesToLatin() {
  try {
    console.log('🔄 Начинаем переименование файлов на латиницу...\n')

    const imagesDir = path.join(process.cwd(), 'public', 'images')
    let renamedCount = 0
    let skippedCount = 0

    // Переименовываем файлы
    for (const [cyrillicName, latinName] of Object.entries(fileMapping)) {
      const oldPath = path.join(imagesDir, cyrillicName)
      const newPath = path.join(imagesDir, latinName)
      
      if (fs.existsSync(oldPath)) {
        try {
          fs.renameSync(oldPath, newPath)
          console.log(`✅ ${cyrillicName} -> ${latinName}`)
          renamedCount++
        } catch (error) {
          console.log(`❌ Ошибка при переименовании ${cyrillicName}: ${error}`)
        }
      } else {
        console.log(`⚠️  Файл не найден: ${cyrillicName}`)
        skippedCount++
      }
    }

    console.log(`\n📈 Результаты переименования:`)
    console.log(`✅ Переименовано: ${renamedCount}`)
    console.log(`⚠️  Пропущено: ${skippedCount}`)

    // Обновляем базу данных
    console.log(`\n🔄 Обновляем базу данных...`)
    
    const products = await prisma.product.findMany()
    let updatedCount = 0

    for (const product of products) {
      const oldImagePath = product.image
      const fileName = path.basename(oldImagePath)
      
      if (fileMapping[fileName]) {
        const newImagePath = `/images/${fileMapping[fileName]}`
        
        await prisma.product.update({
          where: { id: product.id },
          data: { image: newImagePath }
        })
        
        console.log(`✅ ${product.name}: ${oldImagePath} -> ${newImagePath}`)
        updatedCount++
      }
    }

    console.log(`\n📈 Результаты обновления БД:`)
    console.log(`✅ Обновлено товаров: ${updatedCount}`)

  } catch (error) {
    console.error('❌ Ошибка при переименовании:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
renameImagesToLatin()
