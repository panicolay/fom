import { Routes, Route } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'
import { StructurePage } from './pages/StructurePage'
import { NotFoundPage } from './pages/NotFoundPage'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="structures/:structureId" element={<StructurePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}