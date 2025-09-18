// Тестовые данные товаров для Pideh Armenia
import { Product } from '@prisma/client'

export const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Пиде
  {
    name: 'Классическая Хачапури',
    description: 'Традиционное армянское пиде с сыром сулугуни и яйцом',
    price: 2500,
    image: '/images/classic-khachapuri.jpg',
    category: 'Пиде',
    ingredients: ['Тесто', 'Сыр сулугуни', 'Яйцо', 'Масло', 'Соль'],
    isAvailable: true,
  },
  {
    name: 'Мясная Хачапури',
    description: 'Хачапури с говядиной, луком и специями',
    price: 3200,
    image: '/images/meat-khachapuri.jpg',
    category: 'Пиде',
    ingredients: ['Тесто', 'Говядина', 'Лук', 'Сыр', 'Специи'],
    isAvailable: true,
  },
  {
    name: 'Сырная Хачапури',
    description: 'Смесь сыров: сулугуни, моцарелла и чеддер',
    price: 2800,
    image: '/images/cheese-khachapuri.jpg',
    category: 'Пиде',
    ingredients: ['Тесто', 'Сулугуни', 'Моцарелла', 'Чеддер', 'Масло'],
    isAvailable: true,
  },
  {
    name: 'Пепперони Пиде',
    description: 'Острая пиде с колбасой пепперони и сыром',
    price: 2900,
    image: '/images/pepperoni-pide.jpg',
    category: 'Пиде',
    ingredients: ['Тесто', 'Пепперони', 'Моцарелла', 'Томатный соус'],
    isAvailable: true,
  },
  {
    name: 'Овощная Пиде',
    description: 'Вегетарианская пиде с свежими овощами',
    price: 2200,
    image: '/images/ovoshchnoe-pide.jpg',
    category: 'Пиде',
    ingredients: ['Тесто', 'Помидоры', 'Перец', 'Лук', 'Сыр'],
    isAvailable: true,
  },
  
  // Комбо
  {
    name: 'Комбо "Я один"',
    description: 'Пиде + напиток + соус',
    price: 3500,
    image: '/images/kombo-ya-odin.jpg',
    category: 'Комбо',
    ingredients: ['Пиде на выбор', 'Напиток', 'Соус'],
    isAvailable: true,
  },
  {
    name: 'Комбо "Мы вдвоем"',
    description: '2 пиде + 2 напитка + соусы',
    price: 6500,
    image: '/images/kombo-my-vdvoyom.jpg',
    category: 'Комбо',
    ingredients: ['2 пиде на выбор', '2 напитка', 'Соусы'],
    isAvailable: true,
  },
  {
    name: 'Комбо "Я голодный"',
    description: 'Большая пиде + картофель фри + напиток',
    price: 4200,
    image: '/images/kombo-my-golodny.jpg',
    category: 'Комбо',
    ingredients: ['Большая пиде', 'Картофель фри', 'Напиток'],
    isAvailable: true,
  },
  
  // Напитки
  {
    name: 'Кола/Спрайт/Фанта',
    description: 'Газированные напитки 0.5л',
    price: 800,
    image: '/images/cola-sprite-fanta.jpg',
    category: 'Напитки',
    ingredients: ['Газированная вода', 'Сахар', 'Ароматизаторы'],
    isAvailable: true,
  },
  {
    name: 'Сок',
    description: 'Натуральный сок 0.3л',
    price: 600,
    image: '/images/juice.jpg',
    category: 'Напитки',
    ingredients: ['Натуральный сок'],
    isAvailable: true,
  },
  
  // Соусы
  {
    name: 'Кетчуп',
    description: 'Томатный соус',
    price: 200,
    image: '/images/Ketchup-Pideh.jpg',
    category: 'Соусы',
    ingredients: ['Томаты', 'Сахар', 'Уксус', 'Специи'],
    isAvailable: true,
  },
  {
    name: 'Майонез',
    description: 'Классический майонез',
    price: 200,
    image: '/images/Mayonnaise-Pideh.jpg',
    category: 'Соусы',
    ingredients: ['Яйца', 'Масло', 'Уксус', 'Горчица'],
    isAvailable: true,
  },
  {
    name: 'Чесночный соус',
    description: 'Острый чесночный соус',
    price: 250,
    image: '/images/Garlic-sauce-Pideh.jpg',
    category: 'Соусы',
    ingredients: ['Чеснок', 'Майонез', 'Специи'],
    isAvailable: true,
  },
]

export const categories = [
  'Все',
  'Комбо',
  'Пиде',
  'Снэк',
  'Соусы',
  'Освежающие напитки',
] as const

export type Category = typeof categories[number]
