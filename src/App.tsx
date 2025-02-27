import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext'

function App() {
  return (
    <BrowserRouter>
      <KeyboardShortcutsProvider>
        <Router />
      </KeyboardShortcutsProvider>
    </BrowserRouter>
  )
}

export default App
