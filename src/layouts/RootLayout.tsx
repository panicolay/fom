import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { Panel } from '../components/overlays/Panel'
import { StructureForm } from '../components/structures/StructureForm'
import { useEffect, useState } from 'react'
import { Structure } from '../types/structureTypes'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'

export function RootLayout() {
  const [structureToEdit, setStructureToEdit] = useState<Structure | null>(null)
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
  const [isStructureFormOpen, setIsStructureFormOpen] = useState(false)

  useEffect(() => {
    if (!isStructureFormOpen) {
      registerShortcut('openStructureForm', { key: 'n' }, () => {
        handleStructureFormOpen()
      })
      return () => unregisterShortcut('openStructureForm')
    }
  }, [registerShortcut, unregisterShortcut, isStructureFormOpen])

  const handleStructureFormOpen = (structure?: Structure) => {
    setStructureToEdit(structure || null)
    setIsStructureFormOpen(true)
  }

  const handleStructureFormClose = () => {
    setIsStructureFormOpen(false)
    setStructureToEdit(null)
  }
  
  return (
    <div className="min-h-screen flex flex-col">
  
      <TopBar onNewStructureClick={() => handleStructureFormOpen()} />

      <main className="">
        <div className="container mx-auto flex flex-col my-14 gap-14">
          <Outlet context={{ handleStructureFormOpen }} />
        </div>
      </main>

      <footer className=""></footer>

      <Panel 
        isOpen={isStructureFormOpen}
        onClose={handleStructureFormClose}
        title={structureToEdit ? <>edit<br/>structure</> : <>new <br/>structure</>}
      >
        <StructureForm 
            isOpen={isStructureFormOpen}
            onClose={handleStructureFormClose}
            structure={structureToEdit}
        />
      </Panel>
    </div>
  )
}