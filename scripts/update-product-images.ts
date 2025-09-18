import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Маппинг названий товаров на файлы изображений
const imageMapping: { [key: string]: string } = {
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
  'Сладкая пиде': '/images/sladkiy-pide.jpg',
  'Пиде хот-дог': '/images/pide-hot-dog.jpg',
  'Пиде с грушей': '/images/pide-blue-pear.jpg',
  'Шпинат пиде': '/images/shpinat.jpg',
  'Мясная пиде': '/images/2-myasa-pide.jpg',
  'Кавказский сыр пиде': '/images/caucasus-cheese.jpg',

  // Комбо
  'Комбо «Я один»': '/images/kombo-ya-odin.jpg',
  'Комбо «Мы вдвоем»': '/images/kombo-my-vdvoyom.jpg',
  'Комбо «Я голодный»': '/images/kombo-my-golodny.jpg',
  'Комбо «Я очень голодный»': '/images/kombo-my-ochen-golodny.jpg',

  // Напитки
  'Кола/Спрайт/Фанта': '/images/cola-sprite-fanta.jpg',
  'Сок': '/images/juice.jpg',
  'Tan': '/images/tan.jpg',

  // Соусы
  'Кетчуп': '/images/Ketchup-Pideh.jpg',
  'Майонез': '/images/Mayonnaise-Pideh.jpg',
  'Чесночный соус': '/images/Garlic-sauce-Pideh.jpg',
  'Горчичный соус': '/images/Mustard-sauce-Pideh.jpg',
  'BBQ соус': '/images/BBQ-sauce-Pideh.jpg',
  'Коктейльный соус': '/images/Cocktail-sauce-Pideh.jpg',

  // Снэк
  'Картофель фри': '/images/kartofel-fri.jpg',
  'Куриный попкорн': '/images/kurinyy-popkorn.jpg'
}

async function updateProductImages() {
  try {
    console.log('🔄 Обновляем изображения товаров...')
    
    const products = await prisma.product.findMany()
    let updatedCount = 0
    
    for (const product of products) {
      const newImage = imageMapping[product.name]
      
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
    
    console.log(`\n✅ Обновлено ${updatedCount} товаров из ${products.length}`)
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении изображений:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductImages()
