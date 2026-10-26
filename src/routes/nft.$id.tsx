import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '../components/ui/button'
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

interface NFTResponse {
  items: NFT[]
}

export const Route = createFileRoute('/nft/$id')({
  component: NFTDetailComponent,
})

function NFTDetailComponent() {
  const { id } = Route.useParams()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [selectedEdition, setSelectedEdition] = useState('1/50')
  const [addedSuccess, setAddedSuccess] = useState(false)

  // 1. Busca os detalhes do NFT
  const { data: nft, isLoading, isError } = useQuery<NFT>({
    queryKey: ['nft', id],
    queryFn: async () => {
      const res = await axios.get(`/api/nfts/${id}`)
      return res.data
    },
    retry: false,
  })

  // 2. Busca itens para a secção "Mais desta coleção"
  const { data: relatedData } = useQuery<NFTResponse>({
    queryKey: ['nfts-related'],
    queryFn: async () => {
      const res = await axios.get('/api/nfts')
      return res.data
    },
  })

  // 3. Mutation para adicionar ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await axios.post('/api/cart', { nftId: id, quantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 3000)
    },
  })

  if (isLoading) {
    return (
      <div className="py-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
        <div className="h-96 bg-stone-900 rounded-xl animate-pulse border border-stone-800" />
        <div className="space-y-4">
          <div className="h-8 bg-stone-900 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-stone-900 rounded w-1/2 animate-pulse" />
          <div className="h-32 bg-stone-900 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (isError || !nft) {
    return (
      <div className="py-16 text-center space-y-4 font-mono">
        <h1 className="text-2xl font-bold text-red-500">NFT não encontrado</h1>
        <p className="text-stone-400 text-xs">O token com ID <span className="text-[#FF9000]">{id}</span> não existe.</p>
        <Link to="/">
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] text-xs mt-4">
            Voltar ao Mercado
          </Button>
        </Link>
      </div>
    )
  }

  const editions = ['1/1', '1/10', '1/50', 'ABERTA']

  return (
    <div className="space-y-16 font-mono text-stone-200">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-500">
        <Link to="/" className="hover:text-white">Início</Link> / <span className="text-[#FF9000]">Mercado</span>
      </div>

      {/* Painel Principal de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-stone-900/30 border border-stone-800/80 p-6 rounded-2xl">
        {/* Miniaturas à Esquerda */}
        <div className="lg:col-span-2 hidden md:flex flex-col gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-full h-20 bg-stone-950 border border-stone-800 rounded-lg overflow-hidden cursor-pointer hover:border-[#FF9000]">
              <img src={nft.imageUrl} alt="Thumb" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Imagem Principal */}
        <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-xl overflow-hidden relative">
          <img src={nft.imageUrl} alt={nft.name} className="w-full h-[420px] object-cover" />
        </div>

        {/* Informações e Controlo de Compra */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{nft.name}</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-xl font-bold text-[#FF9000]">{nft.priceETH} ETH</span>
              <span className="text-stone-500">★★★★★ 19 avaliações</span>
            </div>

            <div className="pt-2 text-xs text-stone-400 space-y-1 leading-relaxed">
              <p className="font-bold text-white">Sobre este NFT:</p>
              <p>{nft.description}</p>
            </div>

            {/* Seleção de Edição */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white">Edição:</span>
              <div className="flex gap-2">
                {editions.map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSelectedEdition(ed)}
                    className={`px-3 py-1 rounded text-xs border ${
                      selectedEdition === ed
                        ? 'border-[#FF9000] text-[#FF9000] font-bold bg-[#FF9000]/10'
                        : 'border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex gap-3 items-center">
              {/* Seletor de Quantidade */}
              <div className="flex items-center border border-stone-800 bg-stone-950 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-400 hover:text-white text-xs"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-400 hover:text-white text-xs"
                >
                  +
                </button>
              </div>

              {/* Botão Comprar */}
              <Button
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || !nft.available}
                className="flex-1 bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-10 text-xs uppercase"
              >
                {addToCartMutation.isPending
                  ? 'A Adicionar...'
                  : addedSuccess
                  ? 'Adicionado! ✓'
                  : 'COMPRAR'}
              </Button>

              <Button variant="outline" className="border-stone-800 text-stone-300 hover:border-[#FF9000] h-10 text-xs">
                Favoritar
              </Button>
            </div>

            <div className="text-[11px] text-stone-500 space-y-1">
              <p>ID do token: <span className="text-stone-300">#0042</span></p>
              <p>Coleção: <span className="text-stone-300">{nft.collection}</span></p>
              <p>Rede: <span className="text-stone-300">{nft.network}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição e Direitos Autorais */}
      <div className="space-y-4 border-t border-stone-800 pt-8 text-xs text-stone-400">
        <div className="flex gap-6 border-b border-stone-800 pb-3 font-bold">
          <span className="text-[#FF9000] border-b-2 border-[#FF9000] pb-3">Detalhes do NFT</span>
          <span className="hover:text-white cursor-pointer">Avaliações de colecionadores (19)</span>
        </div>
        <p className="leading-relaxed">
          {nft.name} é uma obra digital {nft.edition} finalizada pela coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na rede {nft.network}.
        </p>
        <p>Direitos autorais do criador: 5% nas vendas secundárias.</p>
      </div>

      {/* Secção "Mais desta coleção" */}
      <div className="space-y-6 pt-6">
        <h3 className="text-lg font-bold text-white">Mais desta coleção</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {relatedData?.items.slice(0, 5).map((item) => (
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