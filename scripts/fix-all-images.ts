import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Полный маппинг всех товаров на изображения
const completeImageMapping: { [key: string]: string } = {
  // Пиде
  'Куриные легкие пиде': '/images/kurinye-legkie-pide.jpg',
  'Пиде с бастурмой': '/images/pide-s-basturmoj.jpg',
  'Овощное пиде': '/images/ovoshchnoe-pide.jpg',
  'Грибное пиде': '/images/gribnoe-pide.jpg',
  'Пиде с пхали': '/images/pide-s-phali.jpg',
  'Пиде с беконом': '/images/pide-s-bekonom.jpg',
  'Пиде с говядиной': '/images/pide-s-govyadinoj.jpg',
  'Пепперони пиде': '/images/pepperoni-pide.jpg',
  'Классическая сырная пиде': '/images/classic-chees.jpg',
  'Сладкий пиде': '/images/sladkiy-pide.jpg',
  'Пиде Хот Дог': '/images/pide-hot-dog.jpg',
  'Пиде Blue Pear': '/images/pide-blue-pear.jpg',
  'Шпинат пиде': '/images/shpinat.jpg',
  'Мясная пиде': '/images/2-myasa-pide.jpg',
  'Кавказский пиде': '/images/caucasus-cheese.jpg',
  '2 мяса пиде': '/images/2-myasa-pide.jpg',
  'Классическое сырное пиде': '/images/classic-chees.jpg',

  // Комбо
  'Комбо «Я один»': '/images/kombo-ya-odin.jpg',
  'Комбо «Мы вдвоем»': '/images/kombo-my-vdvoyom.jpg',
  'Комбо «Я голодный»': '/images/kombo-my-golodny.jpg',
  'Комбо «Я очень голодный»': '/images/kombo-my-ochen-golodny.jpg',
  'Комбо «Мы голодны»': '/images/kombo-my-golodny.jpg',
  'Комбо «Мы очень голодны»': '/images/kombo-my-ochen-golodny.jpg',

  // Напитки
  'Кола/Спрайт/Фанта': '/images/cola-sprite-fanta.jpg',
  'Сок': '/images/juice.jpg',
  'Tan': '/images/tan.jpg',
  'Кока-Кола': '/images/cola-sprite-fanta.jpg',
  'Фанта': '/images/cola-sprite-fanta.jpg',
  'Спрайт': '/images/cola-sprite-fanta.jpg',
  'Минеральная вода': '/images/juice.jpg',
  'Сок (ассорти)': '/images/juice.jpg',

  // Соусы
  'Кетчуп': '/images/Ketchup-Pideh.jpg',
  'Майонез': '/images/Mayonnaise-Pideh.jpg',
  'Чесночный соус': '/images/Garlic-sauce-Pideh.jpg',
  'Горчичный соус': '/images/Mustard-sauce-Pideh.jpg',
  'BBQ соус': '/images/BBQ-sauce-Pideh.jpg',
  'Коктейльный соус': '/images/Cocktail-sauce-Pideh.jpg',
  'Барбекю соус': '/images/BBQ-sauce-Pideh.jpg',
  'Коктейль соус': '/images/Cocktail-sauce-Pideh.jpg',
  'Сырный соус': '/images/caucasus-cheese.jpg',
  'Горчица': '/images/Mustard-sauce-Pideh.jpg',

  // Снэк
  'Картофель фри': '/images/kartofel-fri.jpg',
  'Куриный попкорн': '/images/kurinyy-popkorn.jpg'
}

async function fixAllImages() {
  try {
    console.log('🔄 Исправляем все изображения товаров...')
    
    const products = await prisma.product.findMany()
    let updatedCount = 0
    let notFoundCount = 0
    
    for (const product of products) {
      const newImage = completeImageMapping[product.name]
      
      if (newImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: newImage }
        })
        console.log(`✅ ${product.name} -> ${newImage}`)
        updatedCount++
      } else {
        console.log(`⚠️  Не найдено изображение для: ${product.name}`)
        notFoundCount++
      }
    }
    
    console.log(`\n✅ Обновлено: ${updatedCount} товаров`)
    console.log(`⚠️  Не найдено изображений: ${notFoundCount} товаров`)
    
    // Финальная проверка
    const finalProducts = await prisma.product.findMany()
    const withImages = finalProducts.filter(p => p.image && p.image.startsWith('/images/')).length
    const withoutImages = finalProducts.filter(p => !p.image || !p.image.startsWith('/images/')).length
    
    console.log(`\n📊 Финальная статистика:`)
    console.log(`  С изображениями: ${withImages}`)
    console.log(`  Без изображений: ${withoutImages}`)
    console.log(`  Всего товаров: ${finalProducts.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении изображений:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllImages()
