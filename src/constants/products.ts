// Тестовые данные товаров для Pideh Armenia (только 3 товара)
import { Product } from '@prisma/client'

export const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
