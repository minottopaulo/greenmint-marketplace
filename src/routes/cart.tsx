import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { useState } from 'react'

interface CartItemData {
  nftId: string
  quantity: number
  nft: {
    id: string
    name: string
    priceETH: string
    imageUrl: string
    network: string
  }
}

export const Route = createFileRoute('/cart')({
  component: CartComponent,
})

function CartComponent() {
  const queryClient = useQueryClient()
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false)

  // 1. Busca os itens do carrinho com os dados populados do NFT
  const { data: cartItems = [], isLoading } = useQuery<CartItemData[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axios.get('/api/cart')
      return res.data
    },
  })

  // 2. Mutations para remover item e limpar carrinho
  const removeItemMutation = useMutation({
    mutationFn: async (nftId: string) => {
      await axios.delete(`/api/cart/${nftId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/cart/checkout')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setIsCheckoutSuccess(true)
    },
  })

  // 3. Cálculos de Subtotal, Desconto e Total
  const subtotalETH = cartItems.reduce((acc, item) => {
    return acc + parseFloat(item.nft.priceETH) * item.quantity
  }, 0)

  const discountETH = (subtotalETH * discountPercent) / 100
  const totalETH = Math.max(0, subtotalETH - discountETH)

  // 4. Aplicação de Cupom de Desconto
  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')

    if (couponCode.toUpperCase() === 'JUNGLE10') {
      setDiscountPercent(10)
      setCouponSuccess('Cupom JUNGLE10 aplicado! 10% de desconto.')
    } else if (couponCode.toUpperCase() === 'JUNGLE20') {
      setDiscountPercent(20)
      setCouponSuccess('Cupom JUNGLE20 aplicado! 20% de desconto.')
    } else {
      setCouponError('Cupom inválido. Tente JUNGLE10.')
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 max-w-4xl mx-auto space-y-4 font-mono">
        <div className="h-8 bg-stone-900 rounded w-1/4 animate-pulse" />
        <div className="h-40 bg-stone-900 rounded animate-pulse" />
      </div>
    )
  }

  if (isCheckoutSuccess) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h1 className="text-3xl font-bold text-green-500">Compra realizada com sucesso! 🎉</h1>
        <p className="text-stone-300">
          Seus tokens já foram transferidos para a sua carteira no marketplace.
        </p>
        <Link to="/">
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] mt-4">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h1 className="text-2xl font-bold text-white">Seu carrinho está vazio</h1>
        <p className="text-stone-400">Explore os NFTs disponíveis no nosso marketplace.</p>
        <Link to="/">
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] mt-4">
            Explorar NFTs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 font-mono">
      <h1 className="text-3xl font-bold text-[#FF9000]">Seu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.nftId}
              className="bg-stone-900 border border-stone-800 rounded-lg p-4 flex gap-4 items-center justify-between"
            >
              <img
                src={item.nft.imageUrl}
                alt={item.nft.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 space-y-1">
                <span className="text-xs text-amber-500">{item.nft.network}</span>
                <h3 className="font-bold text-white">{item.nft.name}</h3>
                <p className="text-sm text-stone-400">{item.nft.priceETH} ETH</p>
              </div>
              <Button
                variant="outline"
                onClick={() => removeItemMutation.mutate(item.nftId)}
                className="border-red-900/50 text-red-400 hover:bg-red-950/50 hover:text-red-300 text-xs"
              >
                Remover
              </Button>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido e Cupom */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-6 space-y-6 h-fit">
          <h2 className="text-xl font-bold text-white">Resumo</h2>

          {/* Campo de Cupom */}
          <div className="space-y-2">
            <label className="text-xs text-stone-400">Cupom de Desconto</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: JUNGLE10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-sm text-white w-full focus:outline-none focus:border-[#FF9000]"
              />
              <Button
                onClick={handleApplyCoupon}
                className="bg-stone-800 text-white hover:bg-stone-700 text-xs"
              >
                Aplicar
              </Button>
            </div>
            {couponError && <p className="text-xs text-red-400">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-green-400">{couponSuccess}</p>}
          </div>

          {/* Valores */}
          <div className="space-y-2 pt-4 border-t border-stone-800 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span>{subtotalETH.toFixed(4)} ETH</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Desconto ({discountPercent}%)</span>
                <span>-{discountETH.toFixed(4)} ETH</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-stone-800">
              <span>Total</span>
              <span className="text-[#FF9000]">{totalETH.toFixed(4)} ETH</span>
            </div>
          </div>

          <Button
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="w-full bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-12 text-base"
          >
            {checkoutMutation.isPending ? 'Processando...' : 'Finalizar Compra'}
          </Button>
        </div>
      </div>
    </div>
  )
}