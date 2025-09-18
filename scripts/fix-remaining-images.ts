import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Дополнительный маппинг для оставшихся товаров
const additionalMapping: { [key: string]: string } = {
  'Сладкий пиде': '/images/sladkiy-pide.jpg',
  'Пиде Хот Дог': '/images/pide-hot-dog.jpg',
  'Пиде Blue Pear': '/images/pide-blue-pear.jpg',
  'Барбекю соус': '/images/BBQ-sauce-Pideh.jpg',
  'Коктейль соус': '/images/Cocktail-sauce-Pideh.jpg',
  'Сырный соус': '/images/caucasus-cheese.jpg',
  'Горчица': '/images/Mustard-sauce-Pideh.jpg',
  'Кока-Кола': '/images/cola-sprite-fanta.jpg',
  'Фанта': '/images/cola-sprite-fanta.jpg',
  'Спрайт': '/images/cola-sprite-fanta.jpg',
  'Тан': '/images/tan.jpg',
  'Минеральная вода': '/images/juice.jpg',
  'Сок (ассорти)': '/images/juice.jpg',
  'Комбо «Мы голодны»': '/images/kombo-my-golodny.jpg',
  'Комбо «Мы очень голодны»': '/images/kombo-my-ochen-golodny.jpg',
  '2 мяса пиде': '/images/2-myasa-pide.jpg',
  'Классическое сырное пиде': '/images/classic-chees.jpg',
  'Кавказский пиде': '/images/caucasus-cheese.jpg'
}

async function fixRemainingImages() {
  try {
    console.log('🔄 Исправляем оставшиеся изображения...')
    
    const products = await prisma.product.findMany({
      where: {
        image: {
          startsWith: 'https://'
        }
      }
    })
    
    let updatedCount = 0
    
    for (const product of products) {
      const newImage = additionalMapping[product.name]
      
      if (newImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: newImage }
        })
        console.log(`✅ ${product.name} -> ${newImage}`)
        updatedCount++
      } else {
        console.log(`⚠️  Не найдено изображение для: ${product.name}`)
      }
    }
    
    console.log(`\n✅ Исправлено ${updatedCount} товаров`)
    
    // Показываем финальную статистику
    const allProducts = await prisma.product.findMany()
    const localImages = allProducts.filter(p => p.image.startsWith('/images/')).length
    const externalImages = allProducts.filter(p => p.image.startsWith('https://')).length
    
    console.log(`\n📊 Финальная статистика:`)
    console.log(`  Локальные изображения: ${localImages}`)
    console.log(`  Внешние изображения: ${externalImages}`)
    console.log(`  Всего товаров: ${allProducts.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении изображений:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixRemainingImages()
