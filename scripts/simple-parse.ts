// Простой парсер для тестирования buy.am
import puppeteer from 'puppeteer'

async function simpleParse() {
  console.log('🚀 Запускаем простой парсинг buy.am...')
  
  const browser = await puppeteer.launch({
    headless: false, // Показываем браузер для отладки
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // Устанавливаем User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    console.log('📱 Переходим на страницу PIDEH на buy.am...')
    await page.goto('https://buy.am/ru/restaurants/pideh', {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    
    // Ждем загрузки
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log('🔍 Анализируем структуру страницы...')
    
    // Получаем информацию о странице
    const pageInfo = await page.evaluate(() => {
      const title = document.title
      const url = window.location.href
      const bodyText = document.body.textContent || ''
      
      // Ищем все элементы с текстом
      const allElements = document.querySelectorAll('*')
      const textElements = Array.from(allElements)
        .filter(el => {
          const text = el.textContent?.trim() || ''
          return text.length > 5 && text.length < 200
        })
        .slice(0, 20) // Берем первые 20
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent?.trim().substring(0, 100) || ''
        }))
      
      // Ищем изображения
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => ({
          src: img.src,
          alt: img.alt,
          className: img.className
        }))
        .slice(0, 10)
      
      // Ищем элементы с ценами
      const priceElements = Array.from(allElements)
        .filter(el => {
          const text = el.textContent?.trim() || ''
          return /\d+.*драм|AMD|\d+.*₽|\$\d+/.test(text)
        })
        .slice(0, 10)
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent?.trim() || ''
        }))
      
      return {
        title,
        url,
        bodyTextLength: bodyText.length,
        textElements,
        images,
        priceElements
      }
    })
    
    console.log('📊 Информация о странице:')
    console.log(`  Заголовок: ${pageInfo.title}`)
    console.log(`  URL: ${pageInfo.url}`)
    console.log(`  Длина текста: ${pageInfo.bodyTextLength} символов`)
    console.log(`  Найдено текстовых элементов: ${pageInfo.textElements.length}`)
    console.log(`  Найдено изображений: ${pageInfo.images.length}`)
    console.log(`  Найдено элементов с ценами: ${pageInfo.priceElements.length}`)
    
    console.log('\n📝 Первые текстовые элементы:')
    pageInfo.textElements.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tagName}> class="${el.className}"`)
      console.log(`     Текст: ${el.text}`)
    })
    
    console.log('\n💰 Элементы с ценами:')
    pageInfo.priceElements.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tagName}> class="${el.className}"`)
      console.log(`     Текст: ${el.text}`)
    })
    
    console.log('\n🖼️  Изображения:')
    pageInfo.images.forEach((img, i) => {
      console.log(`  ${i + 1}. src="${img.src}"`)
      console.log(`     alt="${img.alt}" class="${img.className}"`)
    })
    
    // Создаем тестовые данные на основе найденной информации
    const testProducts = []
    
    if (pageInfo.priceElements.length > 0) {
      pageInfo.priceElements.forEach((el, i) => {
        const priceMatch = el.text.match(/\d+/)
        const price = priceMatch ? parseInt(priceMatch[0]) : 2000 + (i * 500)
        
        testProducts.push({
          name: `Тестовый продукт ${i + 1}`,
          description: el.text,
          price: price,
          image: pageInfo.images[i]?.src || '',
          category: 'Тестовые',
          ingredients: ['Тестовые ингредиенты'],
          isAvailable: true,
          source: 'buy.am'
        })
      })
    } else {
      // Создаем базовые тестовые продукты
      for (let i = 0; i < 5; i++) {
        testProducts.push({
          name: `Тестовый продукт ${i + 1}`,
          description: `Описание тестового продукта ${i + 1}`,
          price: 2000 + (i * 500),
          image: '',
          category: 'Тестовые',
          ingredients: ['Тестовые ингредиенты'],
          isAvailable: true,
          source: 'buy.am'
        })
      }
    }
    
    console.log(`\n✅ Создано ${testProducts.length} тестовых продуктов`)
    
    // Сохраняем в файл
    const fs = await import('fs')
    const path = await import('path')
    
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const jsonPath = path.join(dataDir, 'buy-am-products.json')
    fs.writeFileSync(jsonPath, JSON.stringify(testProducts, null, 2), 'utf8')
    
    console.log(`💾 Данные сохранены в: ${jsonPath}`)
    
    return testProducts
    
  } catch (error) {
    console.error('❌ Ошибка при парсинге:', error)
    return []
  } finally {
    await browser.close()
  }
}

// Запускаем парсинг
simpleParse().then(products => {
  console.log(`\n🎉 Парсинг завершен! Создано ${products.length} продуктов`)
  process.exit(0)
}).catch(error => {
  console.error('❌ Критическая ошибка:', error)
  process.exit(1)
})
