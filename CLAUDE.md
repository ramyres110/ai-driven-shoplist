# CLAUDE.md

Projeto acadêmico (Faculdade SENAI, 2026/2): lista de compras "AI-First" para quem vai ao mercado. Não tem relação com os sistemas da LG (.NET/WCF/multi-tenant); ignore aquele contexto aqui.

## Comandos

```bash
npm install
npm run dev       # servidor de desenvolvimento (Vite)
npm run build     # build de produção em dist/
npm run preview   # serve o build; o service worker só fica ativo aqui, não no dev
```

Não há testes, lint nem CI configurados ainda. Para validar uma mudança, rode `npm run build` e confira no navegador.

## Stack

- React 18 + Vite 6, JavaScript puro (JSX, sem TypeScript), ES modules.
- `vite-plugin-pwa` (Workbox, `registerType: 'autoUpdate'`). Manifest e ícones PNG são gerados no build a partir de `public/favicon.svg` (preset `minimal-2023`); não versione PNGs de ícone à mão.
- Sem backend: os dados ficam no `localStorage`, na chave `shoplist:items`.

## Estrutura

```
index.html             # entrada; lang pt-BR, theme-color #16a34a
vite.config.js         # React + PWA (manifest, ícones, cache do Workbox)
public/favicon.svg     # fonte única dos ícones do app
src/
  main.jsx             # monta <App /> em StrictMode
  App.jsx              # UI: AddItemForm, ItemRow, App (seções, ações, barra de total)
  useShoppingList.js   # estado, persistência no localStorage e cálculo do resumo
  index.css            # estilos com variáveis CSS e tema escuro automático
```

## Modelo e regras de negócio

Item: `{ id, name, quantity, price, bought }`
- `id`: `crypto.randomUUID()`.
- `quantity`: inteiro ≥ 1.
- `price`: preço **unitário** em número, ou `null` quando ainda não foi informado. Subtotal = `price * quantity`.
- `bought`: o item está no carrinho.

Fluxo: planejar (adicionar itens) → no mercado, marcar o item e informar o preço → antes do caixa, ver o total.
- O total soma apenas os itens marcados; itens marcados sem preço contam como 0 e geram o aviso "N itens sem preço".
- **Nova compra** (`resetPurchase`): mantém a lista, desmarca tudo e limpa os preços.
- **Remover comprados** (`clearBought`): apaga os itens marcados.
- As duas ações pedem `window.confirm`.

## Convenções

- Todo texto de interface e todo comentário em português do Brasil.
- Moeda com `Intl.NumberFormat('pt-BR', { currency: 'BRL' })`. A entrada de preço aceita `4,99`, `4.99`, `1.234,56` e `R$` (`parsePrice` em `App.jsx`); o campo é confirmado no blur ou no Enter.
- Toda a lógica de estado fica em `useShoppingList`; os componentes só chamam as ações retornadas (`addItem`, `update`, `removeItem`, `clearBought`, `resetPurchase`). Atualizações de estado são imutáveis, com setter funcional.
- Acesso ao `localStorage` sempre dentro de `try/catch`: se falhar (modo privado, cota cheia), o app segue só em memória.
- Cores por variáveis CSS em `:root`, redefinidas em `prefers-color-scheme: dark`. Layout mobile-first com largura máxima de 640px e barra de total fixa no rodapé.
- Botões só com ícone levam `aria-label`.
- Se mudar o formato do item salvo, trate os dados antigos já gravados no `localStorage` dos usuários (migração em `load()` ou nova chave).

## Estado atual

Feito (MVP, ainda não commitado; só existe o commit inicial):
- Lista com adicionar, remover, ajustar quantidade e marcar como comprado, separada em "A comprar" e "No carrinho".
- Preço unitário por item, subtotal quando a quantidade é maior que 1, total do carrinho e aviso de itens sem preço.
- Persistência local, PWA instalável e offline, tema escuro automático.
- README com o funcionamento e as instruções de execução.

Ainda não existe: a parte de IA (o "AI-First" do nome), testes, lint, deploy e sincronização entre dispositivos.
