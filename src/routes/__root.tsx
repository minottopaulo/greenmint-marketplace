// src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-[#140D0A] text-white font-mono">
      <header className="border-b border-amber-900/30 p-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-[#FF9000]">
          Kurio GreenMint
        </Link>
        <nav className="flex gap-4 text-sm text-gray-300">
          <Link to="/" className="[&.active]:text-[#FF9000]">Início</Link>
          <Link to="/cart" className="[&.active]:text-[#FF9000]">Carrinho</Link>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}