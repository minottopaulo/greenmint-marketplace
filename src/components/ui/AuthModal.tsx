import { useState } from 'react'
import { Button } from '../ui/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-mono">
      <div className="w-[500px] h-[600px] bg-[#241612] border border-stone-800 rounded-xl p-8 flex flex-col justify-between relative shadow-2xl">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* Abas Entrar / Criar Conta */}
        <div className="space-y-6">
          <div className="flex justify-center gap-8 border-b border-stone-800 pb-3 text-sm font-bold">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 ${
                tab === 'login'
                  ? 'text-[#FF9000] border-b-2 border-[#FF9000]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-3 ${
                tab === 'register'
                  ? 'text-[#FF9000] border-b-2 border-[#FF9000]'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Criar conta
            </button>
          </div>

          <p className="text-center text-xs text-stone-400">
            {tab === 'login'
              ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
              : 'Crie seu perfil de colecionador e conecte sua carteira quando quiser.'}
          </p>

          {/* Formulário de Login */}
          {tab === 'login' ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="seu-email@email.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#FF9000]"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#FF9000]"
                />
                <div className="text-right">
                  <a href="#" className="text-[10px] text-stone-500 hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-10 text-xs uppercase"
              >
                Entrar
              </Button>
            </form>
          ) : (
            /* Formulário de Registo */
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Nome de usuário"
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF9000]"
              />
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF9000]"
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF9000]"
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#FF9000]"
              />

              <Button
                onClick={onClose}
                className="w-full bg-[#FF9000] text-black font-bold hover:bg-[#E07D00] h-10 text-xs uppercase"
              >
                Criar conta
              </Button>
            </form>
          )}

          {/* Social Logins exigidos no Figma */}
          <div className="space-y-3 pt-2 text-center text-xs">
            <span className="text-stone-500 text-[10px]">Ou continue com</span>
            <div className="space-y-2">
              <button
                onClick={onClose}
                className="w-full bg-stone-900 border border-stone-800 text-stone-300 py-2 rounded flex items-center justify-center gap-2 hover:border-stone-700 text-xs"
              >
                Continuar com Google
              </button>
              <button
                onClick={onClose}
                className="w-full bg-stone-900 border border-stone-800 text-stone-300 py-2 rounded flex items-center justify-center gap-2 hover:border-stone-700 text-xs"
              >
                Continuar com Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}