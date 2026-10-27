import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { AuthModal } from '../components/ui/AuthModal'

interface CartItem {
  nftId: string
  quantity: number
}

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axios.get('/api/cart')
      return res.data
    },
  })

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-[#140D0A] text-white font-mono flex flex-col justify-between pb-16 md:pb-0">
      {/* Header Fiel ao Figma */}
      <header className="border-b border-stone-800/80 bg-[#140D0A]/95 sticky top-0 z-40 px-4 md:px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-widest text-white">
            KURIO
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-stone-300">
            <Link to="/" className="[&.active]:text-[#FF9000] hover:text-white transition-colors">Início</Link>
            <a href="#" className="hover:text-white transition-colors">Mercado</a>
            <a href="#" className="hover:text-white transition-colors">Criadores</a>
            <a href="#" className="hover:text-white transition-colors">Aprenda</a>
          </nav>

          <div className="hidden md:flex items-center gap-4 text-xs">
            <Link to="/cart" className="bg-stone-900 border border-stone-800 px-3 py-2 rounded flex items-center gap-2 hover:border-[#FF9000]">
              <span>Carrinho</span>
              {cartCount > 0 && (
                <span className="bg-[#FF9000] text-black font-bold text-[10px] rounded-full px-1.5 py-0.2">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-[#FF9000] text-black font-bold px-4 py-2 rounded hover:bg-[#E07D00]"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Autenticação */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Conteúdo Principal */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 w-full space-y-12">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar Mobile (Figma) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#140D0A]/95 border-t border-stone-800/90 backdrop-blur-md z-50 px-6 py-2.5 flex justify-between items-center text-[10px] text-stone-400">
        <Link to="/" className="flex flex-col items-center gap-1 [&.active]:text-[#FF9000]">
          <span className="text-base">🏠</span>
          <span>Início</span>
        </Link>
        <button onClick={() => setIsAuthOpen(true)} className="flex flex-col items-center gap-1">
          <span className="text-base">❤️</span>
          <span>Favoritos</span>
        </button>
        <Link to="/cart" className="flex flex-col items-center gap-1 relative [&.active]:text-[#FF9000]">
          <span className="text-base">🛒</span>
          <span>Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF9000] text-black font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        <button onClick={() => setIsAuthOpen(true)} className="flex flex-col items-center gap-1">
          <span className="text-base">👤</span>
          <span>Perfil</span>
        </button>
      </nav>

      {/* Footer Fiel ao Figma */}
      <footer className="border-t border-stone-800 bg-[#0D0806] pt-12 pb-8 mt-16 text-xs">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          <div className="pt-6 border-t border-stone-900 text-center text-stone-600 text-[11px]">
            &copy; 2026 KURIO. Propriedade digital para todos.
          </div>
        </div>
      </footer>
    </div>
  )
}