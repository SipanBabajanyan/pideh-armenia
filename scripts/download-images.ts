// Скрипт для скачивания изображений продуктов
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const prisma = new PrismaClient()

export async function downloadProductImages() {

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Удаляем файл при ошибке
      reject(err)
    })
  })
}

  try {
    console.log('🖼️  Начинаем скачивание изображений продуктов...')

    // Создаем папку для изображений, если её нет
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
      console.log('📁 Создана папка для изображений продуктов')
    }

    // Получаем все продукты с внешними URL изображений
    const products = await prisma.product.findMany({
      where: {
        image: {
          startsWith: 'http'
        }
      }
    })

    console.log(`📦 Найдено ${products.length} продуктов с внешними изображениями`)

    for (const product of products) {
      try {
        // Определяем расширение файла
        const url = product.image
        const extension = path.extname(new URL(url).pathname) || '.jpg'
        const filename = `${product.id}${extension}`
        const filepath = path.join(imagesDir, filename)

        console.log(`⬇️  Скачиваем: ${product.name}`)
        await downloadImage(url, filepath)

        // Обновляем путь к изображению в базе данных
        await prisma.product.update({
          where: { id: product.id },
          data: { image: `/images/products/${filename}` }
        })

        console.log(`✅ Скачано: ${filename}`)
      } catch (error) {
        console.error(`❌ Ошибка при скачивании ${product.name}:`, error)
      }
    }

    console.log('🎉 Скачивание изображений завершено!')

  } catch (error) {
    console.error('❌ Ошибка при скачивании изображений:', error)
  }
}
