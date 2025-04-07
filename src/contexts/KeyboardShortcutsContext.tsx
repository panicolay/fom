import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type ShortcutHandler = () => void
type Shortcut = {
  key: string
  modifiers?: {
    ctrl?: boolean
    meta?: boolean
    alt?: boolean
    shift?: boolean
  }
}

type ShortcutsContextType = {
  registerShortcut: (id: string, shortcut: Shortcut, handler: ShortcutHandler) => void
  unregisterShortcut: (id: string) => void
}

const KeyboardShortcutsContext = createContext<ShortcutsContextType | null>(null)

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = useState<
    Record<string, { shortcut: Shortcut; handler: ShortcutHandler }>
  >({})

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      Object.entries(shortcuts).forEach(([, { shortcut, handler }]) => {
        const modifiersMatch =
          (!shortcut.modifiers?.ctrl || e.ctrlKey) &&
          (!shortcut.modifiers?.meta || e.metaKey) &&
          (!shortcut.modifiers?.alt || e.altKey) &&
          (!shortcut.modifiers?.shift || e.shiftKey)

        if (modifiersMatch && e.key === shortcut.key) {
          e.preventDefault()
          handler()
        }
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [shortcuts])

  const registerShortcut = useCallback(
    (id: string, shortcut: Shortcut, handler: ShortcutHandler) => {
      setShortcuts((prev) => ({
        ...prev,
        [id]: { shortcut, handler },
      }))
    },
    [],
  )

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts((prev) => {
      const newShortcuts = { ...prev }
      delete newShortcuts[id]
      return newShortcuts
    })
  }, [])

  return (
    <KeyboardShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider')
  }
  return context
}
