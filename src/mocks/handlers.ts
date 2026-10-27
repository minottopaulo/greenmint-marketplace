import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  http.get('/api/nfts', () => HttpResponse.json({ items: db.getNFTs() })),
  http.get('/api/cart', () => HttpResponse.json(db.getCart())),

  http.post('/api/cart', async ({ request }) => {
    const item = (await request.json()) as { nftId: string; quantity: number }
    const cart = db.getCart()
    const existing = cart.find((c) => c.nftId === item.nftId)

    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.push(item)
    }

    db.saveCart(cart)
    return HttpResponse.json(cart)
  }),
]