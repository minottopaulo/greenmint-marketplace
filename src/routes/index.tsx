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

  const collections = [
    { name: 'Arte digital', count: 33 },
    { name: 'Fotografia', count: 12 },
    { name: 'Música', count: 65 },
    { name: 'Arte 3D', count: 39 },
    { name: 'Colecionáveis', count: 23 },
    { name: 'Generativa', count: 17 },
    { name: 'Jogos', count: 19 },
    { name: 'Assinaturas', count: 13 },
    { name: 'Utilidade', count: 18 },
  ]

  const networks = [
    { name: 'Ethereum', count: 119 },
    { name: 'Polygon', count: 78 },
    { name: 'Solana', count: 86 },
  ]

  return (
    <div className="space-y-16 font-mono text-stone-200">
      {/* 1. Hero Banner Principal */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 max-w-lg">
          <span className="text-[11px] text-stone-400">Bem-vindo à Kurio</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
            SEJA DONO DO FUTURO DA ARTE DIGITAL
          </h1>
          <p className="text-stone-400 text-xs leading-relaxed">
            Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
          </p>
          <Button className="bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] px-6 text-xs uppercase">
            EXPLORAR
          </Button>
        </div>
        <div className="w-full md:w-80 h-72 bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
          <img
            src="https://placehold.co/600x400/1e1e1e/FF9000?text=Bored+Ape+%234021"
            alt="Hero NFT"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Conteúdo Principal: Sidebar de Filtros + Grid de NFTs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Esquerda com Categorias, Faixa de Preço e Redes */}
        <aside className="space-y-8 bg-stone-900/30 border border-stone-800/80 p-5 rounded-xl h-fit">
          {/* Busca por texto */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white">Buscar</label>
            <input
              type="text"
              placeholder="Buscar NFTs..."
              value={searchParams.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs text-white w-full focus:outline-none focus:border-[#FF9000]"
            />
          </div>

          {/* Coleções / Categorias */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white">Coleções</h3>
            <ul className="space-y-1 text-xs">
              {collections.map((col) => (
                <li
                  key={col.name}
                  onClick={() => updateFilter('category', searchParams.category === col.name ? undefined : col.name)}
                  className={`flex justify-between items-center cursor-pointer py-1 px-2 rounded ${
                    searchParams.category === col.name ? 'bg-[#FF9000]/20 text-[#FF9000] font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>{col.name}</span>
                  <span className="text-[10px] text-stone-600">({col.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Blockchain */}
          <div className="space-y-2 pt-4 border-t border-stone-800">
            <h3 className="text-xs font-bold text-white">Rede</h3>
            <ul className="space-y-1 text-xs">
              {networks.map((net) => (
                <li
                  key={net.name}
                  onClick={() => updateFilter('network', searchParams.network === net.name ? undefined : net.name)}
                  className={`flex justify-between items-center cursor-pointer py-1 px-2 rounded ${
                    searchParams.network === net.name ? 'bg-[#FF9000]/20 text-[#FF9000] font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>{net.name}</span>
                  <span className="text-[10px] text-stone-600">({net.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Promocional da Sidebar */}
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 text-center space-y-3 pt-6">
            <span className="text-[10px] text-[#FF9000] font-bold tracking-wider uppercase">NFT EM DESTAQUE</span>
            <p className="text-xs text-white font-bold">OFERTA LIMITADA</p>
            <img
              src="https://placehold.co/600x400/1e1e1e/FF9000?text=Acoustic+Soul"
              alt="Destaque"
              className="w-full h-36 object-cover rounded"
            />
          </div>
        </aside>

        {/* Grid Principal com 3 Colunas de NFTs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Abas Superiores de Filtro Rápido */}
          <div className="flex justify-between items-center border-b border-stone-800 pb-3 text-xs">
            <div className="flex gap-4 text-stone-400">
              <span className="text-[#FF9000] font-bold border-b-2 border-[#FF9000] pb-3 cursor-pointer">Todos os NFTs</span>
              <span className="hover:text-white cursor-pointer">Novos lançamentos</span>
              <span className="hover:text-white cursor-pointer">Em alta</span>
            </div>
            <span className="text-stone-500 text-[11px]">Ordenar por: Listados recentemente</span>
          </div>

          {/* Grid de NFTs */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-stone-900 rounded-xl animate-pulse border border-stone-800" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16 text-stone-400 bg-stone-900/20 border border-stone-800 rounded-xl">
              Nenhum NFT encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.items.map((nft) => (
                <Link key={nft.id} to="/nft/$id" params={{ id: nft.id }} className="block group">
                  <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-[#FF9000] transition-all duration-300">
                    <div className="h-56 w-full overflow-hidden bg-stone-950">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-[#FF9000] transition-colors truncate">
                        {nft.name}
                      </h3>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500">{nft.network}</span>
                        <span className="text-[#FF9000] font-bold">{nft.priceETH} ETH</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Secção "Diário da Cunhagem" (Blog / Dicas do Figma) */}
      <div className="pt-12 border-t border-stone-800 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Diário da Cunhagem</h2>
          <p className="text-xs text-stone-400">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {[
            { title: 'Como funciona a propriedade de NFTs', time: '12 de setembro | Leitura de 5 min' },
            { title: '10 artistas digitais para acompanhar', time: '13 de setembro | Leitura de 2 min' },
            { title: 'Raridade, atributos e procedência', time: '15 de setembro | Leitura de 3 min' },
            { title: 'Como proteger sua carteira', time: '16 de setembro | Leitura de 2 min' },
          ].map((post, index) => (
            <div key={index} className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 space-y-3">
              <div className="h-32 bg-stone-950 rounded-lg overflow-hidden">
                <img
                  src={`https://placehold.co/600x400/1e1e1e/FF9000?text=Artigo+0${index + 1}`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-stone-500">{post.time}</span>
              <h4 className="font-bold text-white">{post.title}</h4>
              <a href="#" className="text-[#FF9000] text-[11px] font-bold hover:underline block">Ler mais &rarr;</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}