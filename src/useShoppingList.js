import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'shoplist:items'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Item: { id, name, quantity, price (number | null), bought (boolean) }
 * O preço é o valor unitário; o subtotal é price * quantity.
 */
export function useShoppingList() {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // armazenamento indisponível (modo privado, cota cheia): segue só em memória
    }
  }, [items])

  const update = (id, patch) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const addItem = (name, quantity = 1) =>
    setItems((list) => [
      ...list,
      { id: crypto.randomUUID(), name: name.trim(), quantity, price: null, bought: false },
    ])

  const removeItem = (id) => setItems((list) => list.filter((it) => it.id !== id))

  const clearBought = () => setItems((list) => list.filter((it) => !it.bought))

  // Nova compra: mantém os itens, mas desmarca e limpa os preços
  const resetPurchase = () =>
    setItems((list) => list.map((it) => ({ ...it, bought: false, price: null })))

  const summary = useMemo(() => {
    const bought = items.filter((it) => it.bought)
    return {
      total: bought.reduce((sum, it) => sum + (it.price ?? 0) * it.quantity, 0),
      boughtCount: bought.length,
      missingPrice: bought.filter((it) => it.price == null).length,
      count: items.length,
    }
  }, [items])

  return { items, summary, addItem, update, removeItem, clearBought, resetPurchase }
}
