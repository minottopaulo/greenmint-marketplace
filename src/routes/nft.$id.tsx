import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Button } from '../components/ui/button'

interface NFT {
  id: string
  name: string
  collection: string
  category: string
  network: string
  edition: string
  priceETH: string
  imageUrl: string
  creator: string
  owner: string
  description: string
  available: boolean
}

export const Route = createFileRoute('/nft/$id')({
  component: NFTDetailComponent,
})

function NFTDetailComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)

  const { data: nft, isLoading, isError } = useQuery<NFT>({
    queryKey: ['nft', id],
    queryFn: async () => {
      const res = await axios.get('/api/nfts')
      const found = res.data.items.find((item: NFT) => item.id === id)
      if (!found) throw new Error('NFT não encontrado')
      return found
    },
  })

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/cart', { nftId: id, quantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      navigate({ to: '/cart' })
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-mono animate-pulse text-stone-500">
        Carregando detalhes do NFT...
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center font-mono space-y-4">
        <h2 className="text-2xl font-bold text-white">NFT não encontrado</h2>
        <p className="text-xs text-stone-400">O token que procura não existe ou foi removido do catálogo.</p>
        <Link to="/" className="inline-block bg-[#FF9000] text-black font-bold px-4 py-2 rounded text-xs uppercase">
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto font-mono space-y-8 text-stone-200">
      <Link to="/" className="text-xs text-stone-400 hover:text-white transition-colors">
        &larr; Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Imagem do NFT */}
        <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden aspect-square">
          <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
        </div>

        {/* Informações e Ações */}
        <div className="space-y-6">
          <div>
            <span className="text-xs text-[#FF9000] uppercase font-bold tracking-wider">{nft.collection}</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">{nft.name}</h1>
            <p className="text-xs text-stone-400 mt-2">{nft.description}</p>
          </div>

          <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Edição:</span>
              <span className="text-white font-bold">{nft.edition}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Rede:</span>
              <span className="text-white font-bold">{nft.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Criador:</span>
              <span className="text-white font-bold">{nft.creator}</span>
            </div>
          </div>

          {/* Painel de Preço e Quantidade */}
          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-stone-400 uppercase">Preço atual</span>
                <div className="text-2xl font-black text-[#FF9000]">{nft.priceETH} ETH</div>
              </div>

              {/* Seletor de Quantidade */}
              <div className="flex items-center gap-3 bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-stone-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending || !nft.available}
              className="w-full bg-[#FF9000] text-black font-bold py-3 text-xs uppercase hover:bg-[#E07D00] rounded-xl"
            >
              {addToCartMutation.isPending ? 'Adicionando...' : 'Comprar NFT'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}