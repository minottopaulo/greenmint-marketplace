import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '../components/ui/button'

interface NFT {
  id: string
  name: string
  collection: string
  category: string
  network: string
  priceETH: string
  imageUrl: string
  creator: string
  available: boolean
}

interface NFTResponse {
  items: NFT[]
  total: number
}

interface NFTFilters {
  search?: string
  category?: string
  network?: string
  page?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): NFTFilters => {
    return {
      search: (search.search as string) || undefined,
      category: (search.category as string) || undefined,
      network: (search.network as string) || undefined,
      page: Number(search.page) || 1,
    }
  },
  component: IndexComponent,
})

function IndexComponent() {
  const navigate = useNavigate({ from: '/' })
  const searchParams = Route.useSearch()

  const { data, isLoading } = useQuery<NFTResponse>({
    queryKey: ['nfts', searchParams],
    queryFn: async () => {
      const res = await axios.get('/api/nfts', { params: searchParams })
      return res.data
    },
  })

  const updateFilter = (key: keyof NFTFilters, value: unknown) => {
    navigate({
      search: (old: Record<string, unknown>) => ({
        ...old,
        [key]: value || undefined,
        page: key === 'page' ? (value as number) : 1,
      }),
    })
  }

  const categories = ['Arte digital', 'Fotografia', 'Música', 'Arte 3D']

  return (
    <div className="space-y-12 font-mono">
      {/* Hero Banner do Figma */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-bold text-[#FF9000] tracking-widest uppercase bg-[#FF9000]/10 px-3 py-1 rounded-full border border-[#FF9000]/20">
            Marketplace Oficial
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Descubra e Colecione NFTs Exclusivos
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Compre, venda e explore ativos digitais autenticados na blockchain com taxas mínimas e entrega instantânea.
          </p>
        </div>
        <div className="w-full md:w-72 h-64 bg-stone-800/50 rounded-xl border border-stone-700/50 overflow-hidden relative group">
          <img
            src="https://placehold.co/600x400/1e1e1e/FF9000?text=Bored+Ape+%234021"
            alt="Destaque"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-xs text-stone-300">Destaque da Semana</p>
            <p className="font-bold text-white text-sm">Bored Ape #4021</p>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pt-4">
        <input
          type="text"
          placeholder="Buscar por nome ou criador..."
          value={searchParams.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-white w-full md:w-80 focus:outline-none focus:border-[#FF9000] text-sm"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={searchParams.category === cat ? 'default' : 'outline'}
              onClick={() =>
                updateFilter('category', searchParams.category === cat ? undefined : cat)
              }
              className={`text-xs px-4 py-2 ${
                searchParams.category === cat
                  ? 'bg-[#FF9000] text-black font-bold'
                  : 'border-stone-800 text-stone-300 hover:border-[#FF9000]/50'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de 4 Colunas (Alinhado ao Figma Desktop) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 bg-stone-900 rounded-xl animate-pulse border border-stone-800"
            />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 text-stone-400 bg-stone-900/40 border border-stone-800 rounded-xl">
          Nenhum NFT encontrado para os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.items.map((nft) => (
            <Link
              key={nft.id}
              to="/nft/$id"
              params={{ id: nft.id }}
              className="block group"
            >
              <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#FF9000] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF9000]/10">
                <div className="h-52 w-full overflow-hidden bg-stone-950">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-500 font-bold">{nft.network}</span>
                    <span className="text-stone-500">{nft.creator}</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-[#FF9000] transition-colors truncate">
                    {nft.name}
                  </h3>
                  <div className="flex justify-between items-center pt-3 border-t border-stone-800">
                    <span className="text-xs text-stone-400">Preço</span>
                    <span className="text-[#FF9000] font-bold text-sm">
                      {nft.priceETH} ETH
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}