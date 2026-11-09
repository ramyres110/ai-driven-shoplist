import { useState } from 'react'
import { useShoppingList } from './useShoppingList.js'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// Aceita "4,99", "4.99" e "1.234,56"
function parsePrice(text) {
  const clean = text.trim().replace(/\s|R\$/g, '')
  if (!clean) return null
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean
  const value = Number(normalized)
  return Number.isFinite(value) && value >= 0 ? value : null
}

function formatPriceInput(value) {
  return value == null ? '' : value.toFixed(2).replace('.', ',')
}

function AddItemForm({ onAdd }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name, Math.max(1, Number(quantity) || 1))
    setName('')
    setQuantity(1)
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        className="add-name"
        placeholder="Adicionar item (ex.: Arroz 5kg)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Nome do item"
        autoComplete="off"
      />
      <input
        className="add-qty"
        type="number"
        min="1"
        inputMode="numeric"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        aria-label="Quantidade"
      />
      <button type="submit" className="btn primary" aria-label="Adicionar">
        +
      </button>
    </form>
  )
}

function ItemRow({ item, onUpdate, onRemove }) {
  const [priceText, setPriceText] = useState(formatPriceInput(item.price))

  const commitPrice = () => {
    const price = parsePrice(priceText)
    onUpdate(item.id, { price })
    setPriceText(formatPriceInput(price))
  }

  const toggle = () => onUpdate(item.id, { bought: !item.bought })

  const changeQty = (delta) => onUpdate(item.id, { quantity: Math.max(1, item.quantity + delta) })

  return (
    <li className={`item ${item.bought ? 'bought' : ''}`}>
      <label className="item-main">
        <input type="checkbox" checked={item.bought} onChange={toggle} />
        <span className="item-name">{item.name}</span>
      </label>

      <div className="item-qty">
        <button type="button" className="btn small" onClick={() => changeQty(-1)} aria-label="Diminuir">
          −
        </button>
        <span>{item.quantity}</span>
        <button type="button" className="btn small" onClick={() => changeQty(1)} aria-label="Aumentar">
          +
        </button>
      </div>

      {item.bought && (
        <div className="item-price">
          <span className="prefix">R$</span>
          <input
            placeholder="0,00"
            inputMode="decimal"
            value={priceText}
            onChange={(e) => setPriceText(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            aria-label={`Preço unitário de ${item.name}`}
            autoFocus={item.price == null}
          />
          {item.price != null && item.quantity > 1 && (
            <span className="subtotal">= {currency.format(item.price * item.quantity)}</span>
          )}
        </div>
      )}

      <button type="button" className="btn ghost remove" onClick={() => onRemove(item.id)} aria-label="Remover">
        ✕
      </button>
    </li>
  )
}

export default function App() {
  const { items, summary, addItem, update, removeItem, clearBought, resetPurchase } = useShoppingList()

  const pending = items.filter((it) => !it.bought)
  const bought = items.filter((it) => it.bought)

  const confirm = (message, action) => window.confirm(message) && action()

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Lista de Compras</h1>
        <p className="progress">
          {summary.boughtCount} de {summary.count} no carrinho
        </p>
      </header>

      <main>
        <AddItemForm onAdd={addItem} />

        {items.length === 0 && <p className="empty">Sua lista está vazia. Adicione o primeiro item acima.</p>}

        {pending.length > 0 && (
          <section>
            <h2>A comprar ({pending.length})</h2>
            <ul className="list">
              {pending.map((it) => (
                <ItemRow key={it.id} item={it} onUpdate={update} onRemove={removeItem} />
              ))}
            </ul>
          </section>
        )}

        {bought.length > 0 && (
          <section>
            <h2>No carrinho ({bought.length})</h2>
            <ul className="list">
              {bought.map((it) => (
                <ItemRow key={it.id} item={it} onUpdate={update} onRemove={removeItem} />
              ))}
            </ul>
          </section>
        )}

        {items.length > 0 && (
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => confirm('Desmarcar tudo e limpar os preços para uma nova compra?', resetPurchase)}
            >
              Nova compra
            </button>
            {bought.length > 0 && (
              <button
                type="button"
                className="btn danger"
                onClick={() => confirm('Remover da lista os itens já comprados?', clearBought)}
              >
                Remover comprados
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="total-bar">
        <div>
          <span className="total-label">Total no carrinho</span>
          {summary.missingPrice > 0 && (
            <span className="warning">
              {summary.missingPrice} {summary.missingPrice === 1 ? 'item' : 'itens'} sem preço
            </span>
          )}
        </div>
        <strong className="total-value">{currency.format(summary.total)}</strong>
      </footer>
    </div>
  )
}
