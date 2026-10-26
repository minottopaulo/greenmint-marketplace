import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { data: cartItems } = useQuery<{ nftId: string }[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axios.get('/api/cart')
      return res.data
    },
  })

  const cartCount = cartItems?.length || 0

  return (
    <div className="min-h-screen bg-[#140D0A] text-white font-mono flex flex-col justify-between">
      {/* Header Fiel ao Figma */}
      <header className="border-b border-stone-800/80 bg-[#140D0A]/95 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-black tracking-widest text-white">
              KURIO
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs text-stone-300">
              <Link to="/" className="[&.active]:text-[#FF9000] hover:text-white transition-colors">Início</Link>
              <a href="#" className="hover:text-white transition-colors">Mercado</a>
              <a href="#" className="hover:text-white transition-colors">Criadores</a>
              <a href="#" className="hover:text-white transition-colors">Aprenda</a>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/cart" className="bg-stone-900 border border-stone-800 px-3 py-2 rounded flex items-center gap-2 hover:border-[#FF9000]">
              <span>Carrinho</span>
              {cartCount > 0 && (
                <span className="bg-[#FF9000] text-black font-bold text-[10px] rounded-full px-1.5 py-0.2">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="bg-[#FF9000] text-black font-bold px-4 py-2 rounded hover:bg-[#E07D00]">
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-[1440px] mx-auto px-6 py-8 flex-1 w-full space-y-16">
        <Outlet />
      </main>

      {/* Footer Fiel ao Figma */}
      <footer className="border-t border-stone-800 bg-[#0D0806] pt-12 pb-8 mt-16 text-xs">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          {/* Medalhões de Recursos + Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-stone-800/60">
            <div className="flex gap-3 items-start">
              <div className="bg-[#FF9000]/20 text-[#FF9000] p-2.5 rounded-full font-bold">W</div>
              <div>
                <h4 className="font-bold text-white text-sm">Segurança da carteira</h4>
                <p className="text-stone-400 text-[11px] mt-1 leading-relaxed">Proteja sua carteira e colecione arte digital verificada com confiança.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-[#FF9000]/20 text-[#FF9000] p-2.5 rounded-full font-bold">C</div>
              <div>
                <h4 className="font-bold text-white text-sm">Criadores em destaque</h4>
                <p className="text-stone-400 text-[11px] mt-1 leading-relaxed">Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-[#FF9000]/20 text-[#FF9000] p-2.5 rounded-full font-bold">D</div>
              <div>
                <h4 className="font-bold text-white text-sm">Alertas de lançamentos</h4>
                <p className="text-stone-400 text-[11px] mt-1 leading-relaxed">Receba calendários de cunhagem, novidades de listas de acesso e análises.</p>
              </div>
            </div>
            <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-lg space-y-2">
              <h4 className="font-bold text-white text-xs">Antecipe-se ao próximo lançamento</h4>
              <div className="flex gap-2 pt-1">
                <input
                  type="email"
                  placeholder="digite seu e-mail..."
                  className="bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 w-full focus:outline-none focus:border-[#FF9000] text-[11px]"
                />
                <button className="bg-[#FF9000] text-black font-bold px-3 py-1.5 rounded hover:bg-[#E07D00] text-[11px]">
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Links e Carteiras Compatíveis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-stone-400">
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Meu perfil</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-[#FF9000]">Minha coleção</a></li>
                <li><a href="#" className="hover:text-[#FF9000]">Atividade</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Central de ajuda</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-[#FF9000]">Como comprar NFTs</a></li>
                <li><a href="#" className="hover:text-[#FF9000]">Carteira e segurança</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Coleções</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-[#FF9000]">Arte digital</a></li>
                <li><a href="#" className="hover:text-[#FF9000]">Fotografia</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Carteiras compatíveis</h5>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-[10px]">METAMASK</span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-[10px]">WALLETCONNECT</span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-[10px]">COINBASE</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-900 text-center text-stone-600 text-[11px]">
            &copy; 2026 KURIO. Propriedade digital para todos.
          </div>
        </div>
      </footer>
    </div>
  )
}