import { setupWorker } from 'msw/browser'
import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  // Listagem de NFTs com filtros
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const category = url.searchParams.get('category')
    const network = url.searchParams.get('network')

    let items = db.getNFTs()

    if (search) {
      items = items.filter((n) => n.name.toLowerCase().includes(search))
    }
    if (category) {
      items = items.filter((n) => n.category === category)
    }
    if (network) {
      items = items.filter((n) => n.network === network)
    }

    return HttpResponse.json({ items, total: items.length })
  }),

  // Carrinho
  http.get('/api/cart', () => {
    return HttpResponse.json(db.getCart())
  }),

  // Checkout e Validação de Cupons
  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as { coupon?: string }
    const cart = db.getCart()

    if (cart.length === 0) {
      return new HttpResponse('Carrinho vazio', { status: 400 })
    }

    let discount = 0
    if (body.coupon === 'JUNGLE10') discount = 0.1
    if (body.coupon === 'JUNGLE20') discount = 0.2

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    db.saveCart([]) // Limpa carrinho após pedido

    return HttpResponse.json({
      orderId,
      status: 'CONFIRMED',
      discount,
      timestamp: new Date().toISOString(),
    })
  }),
]

export const worker = setupWorker(...handlers)