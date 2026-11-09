# ai-driven-shoplist
App AI-First for shoppers

Lista de compras em React, instalável como PWA e com funcionamento offline.

## Como funciona

1. **Planejamento:** adicione os itens pelo nome, com a quantidade se quiser.
2. **No mercado:** marque cada item ao colocá-lo no carrinho e informe o preço unitário.
3. **Antes do caixa:** a barra inferior mostra o total do carrinho (preço × quantidade) e avisa se algum item marcado ainda está sem preço.

Os dados ficam salvos no `localStorage` do navegador. **Nova compra** desmarca tudo e limpa os preços, mas mantém a lista. **Remover comprados** apaga da lista o que já foi comprado.

## Stack

- React 18 + Vite 6
- `vite-plugin-pwa` (service worker via Workbox, manifest e ícones gerados a partir de `public/favicon.svg`)

## Rodando

Requer Node.js 18+.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # build de produção em dist/
npm run preview   # serve o build (o service worker só fica ativo no build)
```

Para testar a instalação no celular, sirva o build por HTTPS (ou `localhost`), que é exigência dos service workers.

## Estrutura

```
src/
  App.jsx              # telas e componentes (formulário, item, barra de total)
  useShoppingList.js   # estado da lista, persistência e cálculo do total
  index.css            # estilos (com tema escuro automático)
vite.config.js         # configuração do PWA
```
