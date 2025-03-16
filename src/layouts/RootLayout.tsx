import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'

export function RootLayout() {

  return (
    <div className="min-h-screen flex flex-col">
  
      <TopBar />

      <main className="">
        <div className="container mx-auto flex flex-col my-14 gap-14">
          <Outlet />
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
} 