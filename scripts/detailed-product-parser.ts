// Детальный парсер - открывает каждую страницу товара на buy.am и собирает полные данные
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

interface ProductData {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
  source: 'buy.am'
  productId: string
  fullDescription?: string
  weight?: string
  calories?: string
}

// Функция для скачивания изображения
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close(resolve)
        })
      } else {
        file.close()
        fs.unlink(filepath, () => reject(new Error(`Failed to download image: ${response.statusCode}`)))
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => reject(err))
    })
  })
}

// Список всех товаров PIDEH с их ID (на основе URL структуры)
const productUrls = [
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-2-meat&product_id=sw25664',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-bacon&product_id=sw25665',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-beef&product_id=sw25666',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-cheese-classic&product_id=sw25667',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-caucasian&product_id=sw25668',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-chicken-light&product_id=sw25669',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-basturma&product_id=sw25670',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-vegetable&product_id=sw25671',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-mushroom&product_id=sw25672',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-phali&product_id=sw25673',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-spinach&product_id=sw25674',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-pepperoni&product_id=sw25675',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-sweet&product_id=sw25676',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-hotdog&product_id=sw25677',
  'https://buy.am/ru/restaurants/pideh?product_name=pideh-blue-pear&product_id=sw25678',
  'https://buy.am/ru/restaurants/pideh?product_name=combo-ya-odin&product_id=sw981501',
  'https://buy.am/ru/restaurants/pideh?product_name=combo-my-vdvoe&product_id=sw981502',
  'https://buy.am/ru/restaurants/pideh?product_name=combo-my-golodny&product_id=sw981503',
  'https://buy.am/ru/restaurants/pideh?product_name=combo-my-ochen-golodny&product_id=sw981504',
  'https://buy.am/ru/restaurants/pideh?product_name=chicken-popcorn&product_id=sw25679',
  'https://buy.am/ru/restaurants/pideh?product_name=french-fries&product_id=sw25680',
  'https://buy.am/ru/restaurants/pideh?product_name=barbecue-sauce&product_id=sw25681',
  'https://buy.am/ru/restaurants/pideh?product_name=cocktail-sauce&product_id=sw25682',
  'https://buy.am/ru/restaurants/pideh?product_name=cheese-sauce&product_id=sw25683',
  'https://buy.am/ru/restaurants/pideh?product_name=garlic-sauce&product_id=sw25684',
  'https://buy.am/ru/restaurants/pideh?product_name=ketchup&product_id=sw25685',
  'https://buy.am/ru/restaurants/pideh?product_name=mayonnaise&product_id=sw25686',
  'https://buy.am/ru/restaurants/pideh?product_name=mustard&product_id=sw25687',
  'https://buy.am/ru/restaurants/pideh?product_name=coca-cola&product_id=sw25688',
  'https://buy.am/ru/restaurants/pideh?product_name=fanta&product_id=sw25689',
  'https://buy.am/ru/restaurants/pideh?product_name=sprite&product_id=sw25690',
  'https://buy.am/ru/restaurants/pideh?product_name=tan&product_id=sw25691',
  'https://buy.am/ru/restaurants/pideh?product_name=mineral-water&product_id=sw25692',
  'https://buy.am/ru/restaurants/pideh?product_name=juice-assortment&product_id=sw25693'
]

async function parseProductPage(page: any, url: string): Promise<ProductData | null> {
  try {
    console.log(`🔍 Парсим страницу: ${url}`)
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const productData = await page.evaluate(() => {
      // Ищем название товара
      const nameSelectors = [
        'h1',
        '.product-title',
        '.product-name',
        '[data-testid="product-name"]',
        '.menu-item-title',
        '.dish-title'
      ]
      
      let name = ''
      for (const selector of nameSelectors) {
        const element = document.querySelector(selector)
        if (element?.textContent?.trim()) {
          name = element.textContent.trim()
          break
        }
      }
      
      // Ищем описание
      const descSelectors = [
        '.product-description',
        '.product-details',
        '.menu-item-description',
        '.dish-description',
        '[data-testid="product-description"]',
        '.description'
      ]
      
      let description = ''
      for (const selector of descSelectors) {
        const element = document.querySelector(selector)
        if (element?.textContent?.trim()) {
          description = element.textContent.trim()
          break
        }
      }
      
      // Ищем цену
      const priceSelectors = [
        '.price',
        '.product-price',
        '.menu-item-price',
        '[data-testid="price"]',
        '.cost',
        '.amount'
      ]
      
      let price = 0
      for (const selector of priceSelectors) {
        const element = document.querySelector(selector)
        if (element?.textContent?.trim()) {
          const priceText = element.textContent.trim()
          const priceMatch = priceText.match(/[\d,]+/)
          if (priceMatch) {
            price = parseInt(priceMatch[0].replace(/,/g, ''))
            break
          }
        }
      }
      
      // Ищем изображение
      const imageSelectors = [
        '.product-image img',
        '.menu-item-image img',
        '.dish-image img',
        '[data-testid="product-image"] img',
        '.main-image img',
        'img[alt*="product"]',
        'img[alt*="menu"]'
      ]
      
      let imageUrl = ''
      for (const selector of imageSelectors) {
        const element = document.querySelector(selector) as HTMLImageElement
        if (element?.src) {
          imageUrl = element.src
          break
        }
      }
      
      // Ищем ингредиенты
      const ingredientsSelectors = [
        '.ingredients',
        '.product-ingredients',
        '.menu-item-ingredients',
        '.dish-ingredients',
        '[data-testid="ingredients"]'
      ]
      
      let ingredients: string[] = []
      for (const selector of ingredientsSelectors) {
        const element = document.querySelector(selector)
        if (element?.textContent?.trim()) {
          const text = element.textContent.trim()
          ingredients = text.split(',').map(i => i.trim()).filter(i => i.length > 0)
          break
        }
      }
      
      // Определяем категорию по URL или названию
      let category = 'Пиде'
      if (url.includes('combo')) {
        category = 'Комбо'
      } else if (url.includes('sauce') || url.includes('ketchup') || url.includes('mayonnaise') || url.includes('mustard')) {
        category = 'Соусы'
      } else if (url.includes('popcorn') || url.includes('fries')) {
        category = 'Снэк'
      } else if (url.includes('cola') || url.includes('fanta') || url.includes('sprite') || url.includes('tan') || url.includes('water') || url.includes('juice')) {
        category = 'Освежающие напитки'
      }
      
      // Извлекаем ID продукта из URL
      const productIdMatch = url.match(/product_id=([^&]+)/)
      const productId = productIdMatch ? productIdMatch[1] : ''
      
      return {
        name,
        description,
        price,
        image: imageUrl,
        category,
        ingredients,
        productId,
        isAvailable: true,
        source: 'buy.am'
      }
    })
    
    if (!productData.name) {
      console.log(`⚠️  Не удалось найти данные для ${url}`)
      return null
    }
    
    console.log(`✅ Найден товар: ${productData.name} - ${productData.price} ֏`)
    return productData
    
  } catch (error) {
    console.error(`❌ Ошибка при парсинге ${url}:`, error)
    return null
  }
}

async function parseAllProducts() {
  console.log('🚀 Запускаем детальный парсинг всех товаров buy.am...')
  
  const browser = await puppeteer.launch({
    headless: false, // Показываем браузер для отладки
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Устанавливаем User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    const allProducts: ProductData[] = []
    
    // Создаем папку для изображений
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }
    
    // Парсим каждый товар
    for (let i = 0; i < productUrls.length; i++) {
      const url = productUrls[i]
      console.log(`\n📦 Товар ${i + 1}/${productUrls.length}`)
      
      const productData = await parseProductPage(page, url)
      
      if (productData) {
        // Скачиваем изображение если есть
        if (productData.image && productData.image.startsWith('http')) {
          try {
            const extension = path.extname(new URL(productData.image).pathname) || '.jpg'
            const filename = `${productData.productId}${extension}`
            const filepath = path.join(imagesDir, filename)
            
            console.log(`⬇️  Скачиваем изображение: ${filename}`)
            await downloadImage(productData.image, filepath)
            
            productData.image = `/images/products/${filename}`
            console.log(`✅ Изображение скачано: ${filename}`)
          } catch (error) {
            console.error(`❌ Ошибка при скачивании изображения:`, error)
            productData.image = ''
          }
        }
        
        allProducts.push(productData)
      }
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Сохраняем данные
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir)
    }
    
    const jsonPath = path.join(dataDir, 'buy-am-detailed-products.json')
    fs.writeFileSync(jsonPath, JSON.stringify(allProducts, null, 2))
    console.log(`\n✅ Детальные данные сохранены в ${jsonPath}`)
    
    const csvPath = path.join(dataDir, 'buy-am-detailed-products.csv')
    const csvHeader = Object.keys(allProducts[0]).join(',') + '\n'
    const csvRows = allProducts.map(p => Object.values(p).map(val => {
      if (Array.isArray(val)) return `"${val.join(';')}"`
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')).join('\n')
    fs.writeFileSync(csvPath, csvHeader + csvRows)
    console.log(`✅ CSV данные сохранены в ${csvPath}`)
    
    // Статистика
    console.log(`\n📊 Статистика:`)
    console.log(`  Всего товаров: ${allProducts.length}`)
    
    const categories = allProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} товаров`)
    })
    
    console.log('\n🎉 Детальный парсинг завершен!')
    
  } catch (error) {
    console.error('❌ Ошибка при парсинге:', error)
  } finally {
    await browser.close()
  }
}

parseAllProducts().catch(console.error)
