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

interface NFTResponse {
  items: Array<{
    id: string
    name: string
    priceETH: string
    imageUrl: string
  }>
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

  // 1. Busca os itens do carrinho
  const { data: cartItems = [], isLoading } = useQuery<CartItemData[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axios.get('/api/cart')
      return res.data
    },
  })

  // 2. Busca sugestões ("Colecionadores também viram")
  const { data: suggestions } = useQuery<NFTResponse>({
    queryKey: ['cart-suggestions'],
    queryFn: async () => {
      const res = await axios.get('/api/nfts')
      return res.data
    },
  })

  // Mutations
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

  const subtotalETH = cartItems.reduce((acc, item) => {
    return acc + parseFloat(item.nft.priceETH) * item.quantity
  }, 0)

  const networkFeeETH = cartItems.length > 0 ? 0.016 : 0
  const discountETH = (subtotalETH * discountPercent) / 100
  const totalETH = Math.max(0, subtotalETH - discountETH + networkFeeETH)

  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')

    if (couponCode.toUpperCase() === 'JUNGLE10') {
      setDiscountPercent(10)
      setCouponSuccess('Cupom JUNGLE10 aplicado! (10% OFF)')
    } else if (couponCode.toUpperCase() === 'JUNGLE20') {
      setDiscountPercent(20)
      setCouponSuccess('Cupom JUNGLE20 aplicado! (20% OFF)')
    } else {
      setCouponError('Cupom inválido. Tente JUNGLE10.')
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 max-w-5xl mx-auto space-y-4 font-mono">
        <div className="h-8 bg-stone-900 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-stone-900 rounded animate-pulse" />
      </div>
    )
  }

  if (isCheckoutSuccess) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h1 className="text-2xl font-bold text-green-500">Compra concluída com sucesso! </h1>
        <p className="text-stone-300 text-xs">Os seus tokens foram transferidos para a sua carteira.</p>
        <Link to="/">
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] text-xs mt-4">
            Voltar ao Mercado
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-16 font-mono text-stone-200">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-500">
        <Link to="/" className="hover:text-white">Início</Link> / <span className="text-[#FF9000]">Carrinho</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabela de Itens do Carrinho */}
        <div className="lg:col-span-8 bg-stone-900/30 border border-stone-800/80 p-6 rounded-2xl space-y-4">
          <div className="grid grid-cols-12 text-xs font-bold text-stone-400 border-b border-stone-800 pb-3">
            <span className="col-span-6">NFTs</span>
            <span className="col-span-2 text-right">Preço</span>
            <span className="col-span-2 text-center">Edições</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              O seu carrinho está vazio.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.nftId} className="grid grid-cols-12 items-center text-xs py-3 border-b border-stone-800/50">
                <div className="col-span-6 flex gap-3 items-center">
                  <img src={item.nft.imageUrl} alt={item.nft.name} className="w-12 h-12 object-cover rounded-lg bg-stone-950" />
                  <div>
                    <p className="font-bold text-white">{item.nft.name}</p>
                    <p className="text-[10px] text-stone-500">ID do token: #0042</p>
                  </div>
                </div>
                <span className="col-span-2 text-right text-stone-300">{item.nft.priceETH} ETH</span>
                <span className="col-span-2 text-center font-bold text-white">{item.quantity}</span>
                <div className="col-span-2 text-right space-y-1">
                  <p className="font-bold text-[#FF9000]">{(parseFloat(item.nft.priceETH) * item.quantity).toFixed(2)} ETH</p>
                  <button
                    onClick={() => removeItemMutation.mutate(item.nftId)}
                    className="text-[10px] text-red-400 hover:underline block ml-auto"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumo da Carteira */}
        <div className="lg:col-span-4 bg-stone-900/30 border border-stone-800/80 p-6 rounded-2xl space-y-6 h-fit text-xs">
          <h2 className="text-sm font-bold text-white">Resumo da carteira</h2>

          {/* Campo Promocional */}
          <div className="space-y-2">
            <label className="text-stone-400 text-[11px]">Código promocional</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o código..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-white w-full focus:outline-none focus:border-[#FF9000] text-xs"
              />
              <Button onClick={handleApplyCoupon} className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] text-xs">
                Aplicar
              </Button>
            </div>
            {couponError && <p className="text-red-400 text-[10px]">{couponError}</p>}
            {couponSuccess && <p className="text-green-400 text-[10px]">{couponSuccess}</p>}
          </div>

          {/* Totais */}
          <div className="space-y-2 pt-4 border-t border-stone-800 text-stone-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">{subtotalETH.toFixed(2)} ETH</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Desconto ({discountPercent}%)</span>
                <span>-{discountETH.toFixed(2)} ETH</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxa de rede</span>
              <span className="text-white">{networkFeeETH.toFixed(3)} ETH</span>
            </div>

            <div className="flex justify-between font-bold text-white text-sm pt-3 border-t border-stone-800">
              <span>Total</span>
              <span className="text-[#FF9000]">{totalETH.toFixed(3)} ETH</span>
            </div>
          </div>

          <Button
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending || cartItems.length === 0}
            className="w-full bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-10 text-xs uppercase"
          >
            {checkoutMutation.isPending ? 'A Processar...' : 'Conectar e finalizar'}
          </Button>
        </div>
      </div>

      {/* Secção "Colecionadores também viram" */}
      <div className="space-y-6 pt-6">
        <h3 className="text-base font-bold text-[#FF9000]">Colecionadores também viram</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {suggestions?.items.slice(0, 5).map((item) => (
            <Link key={item.id} to="/nft/$id" params={{ id: item.id }} className="block group">
              <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-[#FF9000] transition-colors">
                <img src={item.imageUrl} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-3">
                  <p className="font-bold text-xs text-white truncate">{item.name}</p>
                  <p className="text-[11px] text-[#FF9000] font-bold mt-1">{item.priceETH} ETH</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}