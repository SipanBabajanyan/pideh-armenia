// Создаем правильные изображения для напитков
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Маппинг изображений для напитков
const drinkImages = {
  'Кока-Кола': '/images/drinks/coca-cola.jpg',
  'Фанта': '/images/drinks/fanta.jpg', 
  'Спрайт': '/images/drinks/sprite.jpg',
  'Тан': '/images/drinks/tan.jpg',
  'Минеральная вода': '/images/drinks/water.jpg',
  'Сок (ассорти)': '/images/drinks/juice.jpg'
}

async function createDrinkImages() {
  try {
    console.log('🥤 Создаем правильные изображения для напитков...\n')
    
    // Создаем папку для изображений напитков
    const drinksDir = path.join(process.cwd(), 'public', 'images', 'drinks')
    if (!fs.existsSync(drinksDir)) {
      fs.mkdirSync(drinksDir, { recursive: true })
      console.log('📁 Создана папка для изображений напитков')
    }
    
    // Получаем все напитки
    const drinks = await prisma.product.findMany({
      where: {
        category: 'Освежающие напитки'
      }
    })
    
    console.log(`📦 Найдено ${drinks.length} напитков`)
    
    // Создаем простые SVG изображения для напитков
    for (const drink of drinks) {
      const drinkName = drink.name
      const svgContent = createDrinkSVG(drinkName)
      const svgPath = path.join(drinksDir, `${drinkName.toLowerCase().replace(/\s+/g, '-')}.svg`)
      
      fs.writeFileSync(svgPath, svgContent)
      
      // Обновляем путь к изображению в базе данных
      const imagePath = `/images/drinks/${drinkName.toLowerCase().replace(/\s+/g, '-')}.svg`
      await prisma.product.update({
        where: { id: drink.id },
        data: { image: imagePath }
      })
      
      console.log(`✅ Создано изображение для: ${drinkName}`)
    }
    
    console.log('\n🎉 Изображения для напитков созданы!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function createDrinkSVG(drinkName: string): string {
  const colors = {
    'Кока-Кола': '#E60012',
    'Фанта': '#FF8C00', 
    'Спрайт': '#00B04F',
    'Тан': '#F0E68C',
    'Минеральная вода': '#87CEEB',
    'Сок (ассорти)': '#FF6347'
  }
  
  const color = colors[drinkName as keyof typeof colors] || '#87CEEB'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}CC;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Bottle body -->
  <rect x="70" y="60" width="60" height="100" rx="8" fill="url(#bottleGradient)" stroke="#333" stroke-width="2"/>
  
  <!-- Bottle neck -->
  <rect x="80" y="50" width="40" height="20" rx="4" fill="url(#bottleGradient)" stroke="#333" stroke-width="2"/>
  
  <!-- Bottle cap -->
  <rect x="75" y="45" width="50" height="15" rx="3" fill="#666" stroke="#333" stroke-width="1"/>
  
  <!-- Liquid level -->
  <rect x="75" y="80" width="50" height="60" rx="4" fill="${color}80"/>
  
  <!-- Bubbles -->
  <circle cx="90" cy="100" r="3" fill="white" opacity="0.7"/>
  <circle cx="110" cy="110" r="2" fill="white" opacity="0.7"/>
  <circle cx="95" cy="120" r="2.5" fill="white" opacity="0.7"/>
  <circle cx="105" cy="130" r="2" fill="white" opacity="0.7"/>
  
  <!-- Label -->
  <rect x="75" y="70" width="50" height="15" rx="2" fill="white" opacity="0.9"/>
  <text x="100" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#333">${drinkName}</text>
</svg>`
}

createDrinkImages()
