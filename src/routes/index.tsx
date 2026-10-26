
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-[#FF9000] mb-4">
        Marketplace de NFTs
      </h1>
      <p className="text-gray-300">
        Setup do TanStack Router a funcionar com sucesso!
      </p>
    </div>
  )
}