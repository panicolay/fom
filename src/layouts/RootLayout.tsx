import { Outlet, Link, useLocation } from 'react-router-dom'

export function RootLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-base-950">
  
      {!isHomePage && (
        <header className="container mx-auto p-6 pb-0">
          <Link to="/" className="font-display text-2xl font-semibold text-base-400 hover:text-base-200">
            FOM
          </Link>
        </header>
      )}

      <main className="">
        <div className="container mx-auto p-6 flex flex-col gap-6">
          <Outlet />
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
} 