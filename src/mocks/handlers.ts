import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  // 1. Listar NFTs com busca e filtros
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const category = url.searchParams.get('category') || ''
    const network = url.searchParams.get('network') || ''

    let items = db.getNFTs()

    if (search) {
      items = items.filter((item) => item.name.toLowerCase().includes(search))
    }
    if (category) {
      items = items.filter((item) => item.category === category)
    }
    if (network) {
      items = items.filter((item) => item.network === network)
    }

    return HttpResponse.json({
      items,
      total: items.length,
    })
  }),

  // 2. Detalhes de um NFT
  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params
    const nft = db.getNFTs().find((item) => item.id === id)

    if (!nft) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(nft)
  }),

  // 3. Obter Itens do Carrinho
  http.get('/api/cart', () => {
    const cart = db.getCart()
    const nfts = db.getNFTs()

    const populatedCart = cart.map((item) => {
      const nft = nfts.find((n) => n.id === item.nftId)
      return {
        ...item,
        nft,
      }
    }).filter((item) => item.nft !== undefined)

    return HttpResponse.json(populatedCart)
  }),

  // 4. Adicionar ao Carrinho
  http.post('/api/cart', async ({ request }) => {
    const body = (await request.json()) as { nftId: string; quantity: number }
    const cart = db.getCart()

    const existingIndex = cart.findIndex((item) => item.nftId === body.nftId)
    if (existingIndex > -1) {
      cart[existingIndex].quantity += body.quantity || 1
    } else {
      cart.push({ nftId: body.nftId, quantity: body.quantity || 1 })
    }

    db.saveCart(cart)
    return HttpResponse.json({ success: true })
  }),

  // 5. Remover Item do Carrinho
  http.delete('/api/cart/:nftId', ({ params }) => {
    const { nftId } = params
    let cart = db.getCart()
    cart = cart.filter((item) => item.nftId !== nftId)
    db.saveCart(cart)
    return HttpResponse.json({ success: true })
  }),

  // 6. Checkout
  http.post('/api/cart/checkout', () => {
    db.saveCart([])
    return HttpResponse.json({ success: true })
  }),
]