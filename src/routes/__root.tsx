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
      <header className="border-b border-stone-800/80 bg-[#140D0A]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-wider text-[#FF9000] flex items-center gap-2">
            <span className="bg-[#FF9000] text-black px-2 py-0.5 rounded text-xs font-black">GM</span>
            GreenMint
          </Link>

          <nav className="flex items-center gap-8 text-sm font-medium text-stone-300">
            <Link to="/" className="[&.active]:text-[#FF9000] hover:text-white transition-colors">
              Início
            </Link>
            <Link to="/cart" className="[&.active]:text-[#FF9000] hover:text-white transition-colors flex items-center gap-2">
              Carrinho
              {cartCount > 0 && (
                <span className="bg-[#FF9000] text-black font-bold text-xs rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer em 4 colunas exigido no Figma */}
      <footer className="border-t border-stone-800 bg-[#0D0806] pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm text-stone-400">
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base">GreenMint</h4>
            <p className="text-xs leading-relaxed">
              O maior marketplace descentralizado de arte digital e colecionáveis NFT.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-1 text-xs">
              <li><Link to="/" className="hover:text-[#FF9000]">Toda a Arte</Link></li>
              <li><Link to="/" className="hover:text-[#FF9000]">Arte 3D</Link></li>
              <li><Link to="/" className="hover:text-[#FF9000]">Música</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Minha Conta</h4>
            <ul className="space-y-1 text-xs">
              <li><Link to="/cart" className="hover:text-[#FF9000]">Meu Carrinho</Link></li>
              <li><a href="#" className="hover:text-[#FF9000]">Carteira</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail..."
                className="bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-xs text-white w-full focus:outline-none focus:border-[#FF9000]"
              />
              <button className="bg-[#FF9000] text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-[#E07D00]">
                OK
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-stone-900 flex justify-between text-xs text-stone-600">
          <span>&copy; 2026 GreenMint. Todos os direitos reservados.</span>
          <span>Redes suportadas: Ethereum • Polygon • Solana</span>
        </div>
      </footer>
    </div>
  )
}