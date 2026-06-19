import { createFileRoute } from '@tanstack/react-router'

import { HomeBackground } from '../components/home-background'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HomeBackground />
      <main className="relative min-h-screen p-8">
        <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
        <p className="mt-4 text-lg text-black/70">
          Edit <code>src/routes/index.tsx</code> to get started.
        </p>
      </main>
    </>
  )
}
