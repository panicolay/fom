import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      <header className=""></header>

      <main className="">
        <div className="container mx-auto p-6 flex flex-col gap-6">
          <Outlet />
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
} 