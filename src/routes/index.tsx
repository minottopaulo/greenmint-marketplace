import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'

interface NFT {
  id: string
  name: string
  collection: string
  category: string
  network: string
  priceETH: string
  imageUrl: string
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
      search: (old) => ({
        ...old,
        [key]: value || undefined,
        page: key === 'page' ? (value as number) : 1,
      }),
    })
  }

  const categories = ['Arte digital', 'Fotografia', 'Música', 'Arte 3D']

  return (
    <div className="py-6 space-y-6 font-mono">
      {/* Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <input
          type="text"
          placeholder="Buscar NFTs..."
          value={searchParams.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="bg-stone-900 border border-stone-800 rounded px-4 py-2 text-white w-full md:w-80 focus:outline-none focus:border-[#FF9000]"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={searchParams.category === cat ? 'default' : 'outline'}
              onClick={() =>
                updateFilter('category', searchParams.category === cat ? undefined : cat)
              }
              className={`text-xs ${
                searchParams.category === cat
                  ? 'bg-[#FF9000] text-black font-bold'
                  : 'border-stone-800 text-stone-300'
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de NFTs com Link para Detalhes */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 bg-stone-900 rounded animate-pulse border border-stone-800"
            />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          Nenhum NFT encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((nft) => (
            <Link
              key={nft.id}
              to="/nft/$id"
              params={{ id: nft.id }}
              className="block group"
            >
              <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#FF9000]/50 transition-colors">
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 space-y-2">
                  <span className="text-xs text-amber-500">{nft.network}</span>
                  <h3 className="font-bold text-lg text-white group-hover:text-[#FF9000] transition-colors">
                    {nft.name}
                  </h3>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                    <span className="text-xs text-stone-400">Preço</span>
                    <span className="text-[#FF9000] font-bold">
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