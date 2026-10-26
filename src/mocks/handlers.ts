// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw'
import { db } from './db'

export const handlers = [
  // 1. Obter todos os NFTs (com suporte a filtros bascos)
  http.get('/api/nfts', async ({ request }) => {
    await delay(300) // Simula latência de rede realista
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const category = url.searchParams.get('category')
    const network = url.searchParams.get('network')

    let nfts = db.getNFTs()

    if (search) {
      nfts = nfts.filter((nft) => nft.name.toLowerCase().includes(search))
    }
    if (category) {
      nfts = nfts.filter((nft) => nft.category === category)
    }
    if (network) {
      nfts = nfts.filter((nft) => nft.network === network)
    }

    return HttpResponse.json({
      items: nfts,
      total: nfts.length,
    })
  }),

  // 2. Detalhes de um NFT específico
  http.get('/api/nfts/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const nft = db.getNFTs().find((n) => n.id === id)

    if (!nft) {
      return new HttpResponse(null, { status: 404, statusText: 'NFT Not Found' })
    }

    return HttpResponse.json(nft)
  }),

  // 3. Obter utilizador atual (Sessão)
  http.get('/api/auth/me', async () => {
    await delay(150)
    const users = db.getUsers()
    // Por padrão no dev, consideramos o primeiro utilizador como ativo
    return HttpResponse.json(users[0])
  }),

  // 4. Obter Carrinho
  http.get('/api/cart', async () => {
    await delay(150)
    return HttpResponse.json(db.getCart())
  }),

  // 5. Adicionar/Atualizar Carrinho
  http.post('/api/cart', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { nftId: string; quantity: number }
    const cart = db.getCart()

    const existingIndex = cart.findIndex((item) => item.nftId === body.nftId)
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = body.quantity
    } else {
      cart.push(body)
    }

    db.saveCart(cart)
    return HttpResponse.json({ success: true, cart })
  }),

  // 6. Reset do Estado Mocado (Para Playwright)
  http.post('/api/mock/reset', async () => {
    db.reset()
    return HttpResponse.json({ message: 'State reset successfully' })
  }),
]