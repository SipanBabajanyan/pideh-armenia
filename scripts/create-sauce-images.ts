// Создаем правильные изображения для соусов
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function createSauceImages() {
  try {
    console.log('🍯 Создаем правильные изображения для соусов...\n')
    
    // Создаем папку для изображений соусов
    const saucesDir = path.join(process.cwd(), 'public', 'images', 'sauces')
    if (!fs.existsSync(saucesDir)) {
      fs.mkdirSync(saucesDir, { recursive: true })
      console.log('📁 Создана папка для изображений соусов')
    }
    
    // Получаем все соусы
    const sauces = await prisma.product.findMany({
      where: {
        category: 'Соусы'
      }
    })
    
    console.log(`📦 Найдено ${sauces.length} соусов`)
    
    // Создаем простые SVG изображения для соусов
    for (const sauce of sauces) {
      const sauceName = sauce.name
      const svgContent = createSauceSVG(sauceName)
      const svgPath = path.join(saucesDir, `${sauceName.toLowerCase().replace(/\s+/g, '-')}.svg`)
      
      fs.writeFileSync(svgPath, svgContent)
      
      // Обновляем путь к изображению в базе данных
      const imagePath = `/images/sauces/${sauceName.toLowerCase().replace(/\s+/g, '-')}.svg`
      await prisma.product.update({
        where: { id: sauce.id },
        data: { image: imagePath }
      })
      
      console.log(`✅ Создано изображение для: ${sauceName}`)
    }
    
    console.log('\n🎉 Изображения для соусов созданы!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function createSauceSVG(sauceName: string): string {
  const colors = {
    'Кетчуп': '#DC143C',
    'Майонез': '#FFF8DC', 
    'Горчица': '#FFD700',
    'Чесночный соус': '#F5F5DC',
    'Коктейль соус': '#FF6347',
    'Сырный соус': '#FFD700',
    'Барбекю соус': '#8B4513'
  }
  
  const color = colors[sauceName as keyof typeof colors] || '#FFD700'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sauceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}CC;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Sauce container -->
  <ellipse cx="100" cy="120" rx="40" ry="30" fill="url(#sauceGradient)" stroke="#333" stroke-width="2"/>
  
  <!-- Sauce top -->
  <ellipse cx="100" cy="100" rx="35" ry="25" fill="${color}80"/>
  
  <!-- Sauce drops -->
  <circle cx="85" cy="90" r="3" fill="${color}CC"/>
  <circle cx="95" cy="85" r="2" fill="${color}CC"/>
  <circle cx="105" cy="88" r="2.5" fill="${color}CC"/>
  <circle cx="115" cy="92" r="2" fill="${color}CC"/>
  
  <!-- Label -->
  <rect x="70" y="60" width="60" height="20" rx="3" fill="white" opacity="0.9"/>
  <text x="100" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#333">${sauceName}</text>
  
  <!-- Spoon -->
  <path d="M 140 80 Q 150 85 140 90 L 135 88 Q 145 83 135 78 Z" fill="#C0C0C0" stroke="#666" stroke-width="1"/>
</svg>`
}

createSauceImages()
