// Обновленные реальные данные на основе скриншотов buy.am
import fs from 'fs'
import path from 'path'

interface ProductData {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
  source: 'buy.am'
}

// Полные данные на основе скриншотов buy.am
const realProducts: ProductData[] = [
  // КОМБО
  {
    name: 'Комбо «Я один»',
    description: 'Пиде с беконом + картофель фри + напиток Tan',
    price: 1700,
    image: 'https://buy.am//media/image/02/c3/56/SW981501_200x200@2x.jpg',
    category: 'Комбо',
    ingredients: ['Пиде с беконом', 'Картофель фри', 'Напиток Tan'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Комбо «Мы вдвоем»',
    description: '2 пиде (пепперони + 2 мяса) + 2 напитка Tan',
    price: 2900,
    image: 'https://buy.am//media/image/0a/db/a6/SW98151_200x200@2x.jpg',
    category: 'Комбо',
    ingredients: ['Пиде пепперони', 'Пиде 2 мяса', '2 напитка Tan'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Комбо «Мы голодны»',
    description: '2 пиде с бастурмой + 2 куриные легкие пиде + картофель фри + кока-кола',
    price: 4900,
    image: 'https://buy.am//media/image/76/60/33/SW98152_200x200@2x.jpg',
    category: 'Комбо',
    ingredients: ['2 пиде с бастурмой', '2 куриные легкие пиде', 'Картофель фри', 'Кока-кола'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Комбо «Мы очень голодны»',
    description: '4 пиде пепперони + 4 классических сырных пиде + картофель фри + куриный попкорн',
    price: 7900,
    image: 'https://buy.am//media/image/90/88/83/SW98153_200x200@2x.jpg',
    category: 'Комбо',
    ingredients: ['4 пиде пепперони', '4 классических сырных пиде', 'Картофель фри', 'Куриный попкорн'],
    isAvailable: true,
    source: 'buy.am'
  },

  // ПИДЕ
  {
    name: '2 мяса пиде',
    description: 'Пиде с двумя видами мяса, зеленым перцем и помидорами',
    price: 950,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', '2 вида мяса', 'Зеленый перец', 'Помидоры черри', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде с беконом',
    description: 'Пиде с хрустящим беконом, сыром и маринованными огурцами',
    price: 950,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Бекон', 'Сыр', 'Маринованные огурцы'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде с говядиной',
    description: 'Пиде с фаршем из говядины, зеленью и помидорами черри',
    price: 950,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Говяжий фарш', 'Зелень', 'Помидоры черри', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Классическое сырное пиде',
    description: 'Традиционное пиде с расплавленным сыром и помидорами черри',
    price: 700,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Сыр', 'Помидоры черри'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Кавказский пиде',
    description: 'Пиде с белым сыром, зеленью и помидорами черри',
    price: 750,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Белый сыр', 'Зелень', 'Помидоры черри'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Куриные легкие пиде',
    description: 'Пиде с курицей, сладким перцем и помидорами черри',
    price: 800,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Курица', 'Сладкий перец', 'Помидоры черри', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде с бастурмой',
    description: 'Пиде с бастурмой, сыром и зеленым перцем',
    price: 950,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Бастурма', 'Сыр', 'Зеленый перец'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Овощное пиде',
    description: 'Пиде с грибами, зеленым луком и помидорами черри',
    price: 800,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Грибы', 'Зеленый лук', 'Помидоры черри', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Грибное пиде',
    description: 'Пиде с жареными грибами и зеленью',
    price: 750,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Жареные грибы', 'Зелень', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде с пхали',
    description: 'Пиде с грузинской овощной пастой пхали и кинзой',
    price: 700,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Пхали', 'Кинза', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Шпинат пиде',
    description: 'Пиде со шпинатом, сыром и помидорами черри',
    price: 900,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Шпинат', 'Сыр', 'Помидоры черри'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пепперони пиде',
    description: 'Пиде с пепперони, сыром и зеленым перцем',
    price: 950,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Пепперони', 'Сыр', 'Зеленый перец'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Сладкий пиде',
    description: 'Десертное пиде с шоколадными конфетами и сладким соусом',
    price: 800,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Шоколадные конфеты', 'Сладкий соус'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде Хот Дог',
    description: 'Пиде с сосисками, сыром и маринованными огурцами',
    price: 900,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Сосиски', 'Сыр', 'Маринованные огурцы'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Пиде Blue Pear',
    description: 'Пиде с грушами и легким соусом',
    price: 850,
    image: '',
    category: 'Пиде',
    ingredients: ['Тесто', 'Груши', 'Легкий соус', 'Сыр'],
    isAvailable: true,
    source: 'buy.am'
  },

  // СНЭК
  {
    name: 'Куриный попкорн',
    description: 'Хрустящие кусочки курицы в панировке',
    price: 600,
    image: '',
    category: 'Снэк',
    ingredients: ['Курица', 'Панировка', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Картофель фри',
    description: 'Хрустящий картофель фри',
    price: 500,
    image: '',
    category: 'Снэк',
    ingredients: ['Картофель', 'Масло', 'Соль'],
    isAvailable: true,
    source: 'buy.am'
  },

  // СОУСЫ
  {
    name: 'Барбекю соус',
    description: 'Пикантный соус барбекю',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Томатная паста', 'Сахар', 'Уксус', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Коктейль соус',
    description: 'Классический коктейльный соус',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Майонез', 'Кетчуп', 'Коньяк', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Сырный соус',
    description: 'Сливочный сырный соус',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Сыр', 'Сливки', 'Масло', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Чесночный соус',
    description: 'Ароматный чесночный соус с зеленью',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Чеснок', 'Майонез', 'Зелень', 'Лимонный сок'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Кетчуп',
    description: 'Классический томатный кетчуп',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Томатная паста', 'Сахар', 'Уксус', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Майонез',
    description: 'Классический майонез',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Яичный желток', 'Масло', 'Уксус', 'Горчица'],
    isAvailable: true,
    source: 'buy.am'
  },
  {
    name: 'Горчица',
    description: 'Острая горчица',
    price: 300,
    image: '',
    category: 'Соусы',
    ingredients: ['Горчичные зерна', 'Уксус', 'Соль', 'Специи'],
    isAvailable: true,
    source: 'buy.am'
  }
]

async function updateRealData() {
  try {
    console.log('🚀 Обновляем данные на основе реальных скриншотов buy.am...')
    
    // Создаем папку data если её нет
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Сохраняем JSON
    const jsonPath = path.join(dataDir, 'buy-am-products.json')
    fs.writeFileSync(jsonPath, JSON.stringify(realProducts, null, 2), 'utf8')
    console.log(`💾 JSON файл сохранен: ${jsonPath}`)
    
    // Сохраняем CSV
    const csvHeader = 'name,description,price,image,category,ingredients,isAvailable,source\n'
    const csvContent = realProducts.map(p => 
      `"${p.name}","${p.description}",${p.price},"${p.image}","${p.category}","${p.ingredients.join(',')}",${p.isAvailable},"${p.source}"`
    ).join('\n')
    
    const csvPath = path.join(dataDir, 'buy-am-products.csv')
    fs.writeFileSync(csvPath, csvHeader + csvContent, 'utf8')
    console.log(`💾 CSV файл сохранен: ${csvPath}`)
    
    // Статистика
    console.log('\n📊 Статистика:')
    const categories = realProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} продуктов`)
    })
    
    console.log(`\n💰 Средняя цена: ${Math.round(realProducts.reduce((sum, p) => sum + p.price, 0) / realProducts.length)} драмов`)
    console.log(`\n🎉 Обновлено ${realProducts.length} продуктов на основе реальных данных!`)
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении данных:', error)
  }
}

// Запускаем обновление данных
updateRealData()
