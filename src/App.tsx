import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <KeyboardShortcutsProvider>
          <Router />
        </KeyboardShortcutsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
