'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product, CartItem, CartContextType } from '@/types'

// Типы для reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// Начальное состояние
const initialState: CartItem[] = []

// Reducer для управления состоянием корзины
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.find(item => item.product.id === product.id)
      
      if (existingItem) {
        return state.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...state, { product, quantity }]
    }
    
    case 'REMOVE_ITEM': {
      return state.filter(item => item.product.id !== action.payload.productId)
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        return state.filter(item => item.product.id !== productId)
      }
      
      return state.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    }
    
    case 'CLEAR_CART':
      return []
    
    default:
      return state
  }
}

// Создание контекста
const CartContext = createContext<CartContextType | undefined>(undefined)

// Провайдер контекста
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Хук для использования контекста корзины
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
