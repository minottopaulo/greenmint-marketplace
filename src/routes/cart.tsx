import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

export const Route = createFileRoute('/cart')({
  component: CartComponent,
})

function CartComponent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [discountRate, setDiscountRate] = useState(0)

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await axios.get('/api/cart')).data,
  })

  const { data: nftsData } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => (await axios.get('/api/nfts')).data,
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/checkout', { coupon })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      alert('Pedido realizado com sucesso!')
      navigate({ to: '/' })
    },
  })

  const applyCoupon = () => {
    if (coupon === 'JUNGLE10') setDiscountRate(0.1)
    else if (coupon === 'JUNGLE20') setDiscountRate(0.2)
    else alert('Cupão inválido!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono text-stone-200">
      <h1 className="text-2xl font-bold text-white uppercase border-b border-stone-800 pb-4">
        Carrinho de NFTs
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 text-stone-500">O seu carrinho está vazio.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.nftId} className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">NFT #{item.nftId}</h3>
                  <span className="text-xs text-stone-400">Qtd: {item.quantity}</span>
                </div>
                <span className="text-[#FF9000] font-bold">1.8500 ETH</span>
              </div>
            ))}
          </div>

          <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl space-y-6 h-fit">
            <h3 className="font-bold text-white border-b border-stone-800 pb-2">Resumo do Pedido</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código promocional"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="bg-stone-950 border border-stone-800 px-3 py-2 text-xs rounded text-white w-full focus:outline-none focus:border-[#FF9000]"
              />
              <button
                onClick={applyCoupon}
                className="bg-stone-800 border border-stone-700 px-3 py-2 text-xs rounded font-bold hover:bg-stone-700"
              >
                Aplicar
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-400 border-t border-stone-800 pt-4">
              <div className="flex justify-between">
                <span>Desconto</span>
                <span className="text-green-400">{discountRate * 100}%</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-stone-800">
                <span>Total</span>
                <span className="text-[#FF9000]">1.8500 ETH</span>
              </div>
            </div>

            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              className="w-full bg-[#FF9000] text-black font-bold py-3 rounded text-xs uppercase hover:bg-[#E07D00] disabled:opacity-50"
            >
              {checkoutMutation.isPending ? 'A processar...' : 'Conectar e Finalizar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}