import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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
  const queryClient = useQueryClient()
  const [addedSuccess, setAddedSuccess] = useState(false)

  // 1. Busca os detalhes do NFT na REST API (MSW)
  const { data: nft, isLoading, isError } = useQuery<NFT>({
    queryKey: ['nft', id],
    queryFn: async () => {
      const res = await axios.get(`/api/nfts/${id}`)
      return res.data
    },
    retry: false, // Não re-tenta em caso de 404
  })

  // 2. Mutation para adicionar ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/cart', { nftId: id, quantity: 1 })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 3000)
    },
  })

  // 3. Estado: Carregando (Skeleton)
  if (isLoading) {
    return (
      <div className="py-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
        <div className="h-96 bg-stone-900 rounded-lg animate-pulse border border-stone-800" />
        <div className="space-y-4">
          <div className="h-8 bg-stone-900 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-stone-900 rounded w-1/2 animate-pulse" />
          <div className="h-24 bg-stone-900 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  // 4. Estado: NFT não encontrado (Cenário 404 testado no Playwright)
  if (isError || !nft) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h1 className="text-3xl font-bold text-red-500">NFT não encontrado</h1>
        <p className="text-stone-400">
          O token com ID <span className="text-amber-500">{id}</span> não existe ou foi removido.
        </p>
        <Link to="/">
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] mt-4">
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
      <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden">
        <img src={nft.imageUrl} alt={nft.name} className="w-full h-auto object-cover" />
      </div>

      <div className="space-y-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>{nft.collection}</span>
            <span className="text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">
              {nft.network} • {nft.edition}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">{nft.name}</h1>
          <p className="text-stone-300 text-sm leading-relaxed">{nft.description}</p>

          <div className="pt-4 border-t border-stone-800 space-y-1">
            <span className="text-xs text-stone-400">Criado por</span>
            <p className="text-amber-400 font-bold">{nft.creator}</p>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-lg space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-stone-400">Preço atual</span>
            <span className="text-2xl font-bold text-[#FF9000]">{nft.priceETH} ETH</span>
          </div>

          <Button
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending || !nft.available}
            className="w-full bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-12 text-base"
          >
            {addToCartMutation.isPending
              ? 'Adicionando...'
              : addedSuccess
              ? 'Adicionado com sucesso! ✓'
              : nft.available
              ? 'Adicionar ao Carrinho'
              : 'Indisponível'}
          </Button>
        </div>
      </div>
    </div>
  )
}