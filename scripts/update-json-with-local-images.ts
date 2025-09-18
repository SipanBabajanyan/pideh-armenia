import fs from 'fs'
import path from 'path'

// Маппинг названий товаров на локальные изображения
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
  'Классическое сырное пиде': '/images/classic-chees.jpg',
  'Сладкий пиде': '/images/sladkiy-pide.jpg',
  'Пиде Хот Дог': '/images/pide-hot-dog.jpg',
  'Пиде Blue Pear': '/images/pide-blue-pear.jpg',
  'Шпинат пиде': '/images/shpinat.jpg',
  'Мясная пиде': '/images/2-myasa-pide.jpg',
  'Кавказский пиде': '/images/caucasus-cheese.jpg',
  '2 мяса пиде': '/images/2-myasa-pide.jpg',

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
  'Минеральная вода': '/images/jur0000.jpg',
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

async function updateJSONWithLocalImages() {
  try {
    console.log('🔄 Обновляем JSON файл с локальными изображениями...')
    
    // Читаем JSON файл
    const jsonPath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    const jsonContent = fs.readFileSync(jsonPath, 'utf8')
    const products = JSON.parse(jsonContent)
    
    console.log(`📊 Найдено ${products.length} товаров в JSON`)
    
    // Обновляем изображения
    let updatedCount = 0
    const updatedProducts = products.map((product: any) => {
      const localImage = imageMapping[product.name]
      if (localImage && product.image !== localImage) {
        updatedCount++
        return {
          ...product,
          image: localImage
        }
      }
      return product
    })
    
    // Создаем резервную копию
    const backupPath = path.join(process.cwd(), 'data', 'buy-am-products-backup.json')
    fs.writeFileSync(backupPath, jsonContent, 'utf8')
    console.log('💾 Создана резервная копия: buy-am-products-backup.json')
    
    // Сохраняем обновленный JSON
    fs.writeFileSync(jsonPath, JSON.stringify(updatedProducts, null, 2), 'utf8')
    
    console.log('✅ JSON файл обновлен с локальными изображениями')
    console.log(`📈 Обновлено изображений: ${updatedCount}`)
    console.log(`📁 Файл сохранен: ${jsonPath}`)
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении JSON:', error)
  }
}

updateJSONWithLocalImages()
