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

async function updateCSVWithLocalImages() {
  try {
    console.log('🔄 Обновляем CSV файл с локальными изображениями...')
    
    // Читаем CSV файл
    const csvPath = path.join(process.cwd(), 'data', 'buy-am-products.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Парсим CSV
    const lines = csvContent.split('\n')
    const header = lines[0]
    const dataLines = lines.slice(1).filter(line => line.trim())
    
    console.log(`📊 Найдено ${dataLines.length} товаров в CSV`)
    
    // Обновляем изображения
    const updatedLines = dataLines.map(line => {
      // Парсим CSV строку (учитываем кавычки)
      const match = line.match(/^"([^"]+)","([^"]*)",(\d+),"([^"]*)","([^"]+)","([^"]*)",(true|false),"([^"]+)"$/)
      
      if (match) {
        const [, name, description, price, image, category, ingredients, isAvailable, source] = match
        
        // Получаем локальное изображение
        const localImage = imageMapping[name] || image
        
        // Формируем обновленную строку
        return `"${name}","${description}",${price},"${localImage}","${category}","${ingredients}",${isAvailable},"${source}"`
      }
      
      return line
    })
    
    // Создаем обновленный CSV
    const updatedCSV = [header, ...updatedLines].join('\n')
    
    // Сохраняем обновленный CSV
    fs.writeFileSync(csvPath, updatedCSV, 'utf8')
    
    console.log('✅ CSV файл обновлен с локальными изображениями')
    
    // Создаем резервную копию
    const backupPath = path.join(process.cwd(), 'data', 'buy-am-products-backup.csv')
    fs.writeFileSync(backupPath, csvContent, 'utf8')
    console.log('💾 Создана резервная копия: buy-am-products-backup.csv')
    
    // Показываем статистику
    let updatedCount = 0
    dataLines.forEach(line => {
      const match = line.match(/^"([^"]+)","([^"]*)",(\d+),"([^"]*)","([^"]+)","([^"]*)",(true|false),"([^"]+)"$/)
      if (match) {
        const [, name, , , image] = match
        if (imageMapping[name] && image !== imageMapping[name]) {
          updatedCount++
        }
      }
    })
    
    console.log(`📈 Обновлено изображений: ${updatedCount}`)
    console.log(`📁 Файл сохранен: ${csvPath}`)
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении CSV:', error)
  }
}

updateCSVWithLocalImages()
