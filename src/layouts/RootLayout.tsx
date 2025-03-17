import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { SidePanel } from '../components/overlays/SidePanel'
import { DeleteDialog } from '../components/overlays/DeleteDialog'
import { StructureForm } from '../components/structures/StructureForm'
import { useEffect, useState } from 'react'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'
import { Structure } from '../types/structureTypes'
import { Track } from '../types/trackTypes'
import { useStructureMutation } from '../hooks/useStructureMutation'
import { useTrackMutation } from '../hooks/useTrackMutation'

type DeletableItem =
  | { type: 'structure', data: Structure }
  | { type: 'track', data: Track }

export function RootLayout() {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
  const [structureToEdit, setStructureToEdit] = useState<Structure | null>(null)
  const [isStructureFormOpen, setIsStructureFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteDialogText, setDeleteDialogText] = useState('')
  const [itemToDelete, setItemToDelete] = useState<DeletableItem | null>(null)
  const { deleteStructure } = useStructureMutation()
  const { deleteTrack } = useTrackMutation()

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

  const handleDeleteStructure = (structure: Structure, text: string) => {
    setItemToDelete({ type: 'structure', data: structure })
    setDeleteDialogText(text)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrack = (track: Track, text: string) => {
    setItemToDelete({ type: 'track', data: track })
    setDeleteDialogText(text)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
    setDeleteDialogText('')
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    
    try {
      if (itemToDelete.type === 'structure') {
        await deleteStructure(itemToDelete.data.id)
      } else if (itemToDelete.type === 'track') {
        await deleteTrack(itemToDelete.data.id)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      handleDeleteDialogClose()
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col">
  
      <TopBar onNewStructureClick={() => handleStructureFormOpen()} />

      <main className="">
        <div className="flex flex-col m-14 gap-14">
          <Outlet
            context={{ 
              handleStructureFormOpen, 
              handleDeleteStructure,
              handleDeleteTrack
            }}
          />
        </div>
      </main>

      <footer className=""></footer>

      <SidePanel 
        isOpen={isStructureFormOpen}
        onClose={handleStructureFormClose}
        title={structureToEdit ? <>edit<br/>structure</> : <>new <br/>structure</>}
      >
        <StructureForm 
            isOpen={isStructureFormOpen}
            onClose={handleStructureFormClose}
            structure={structureToEdit}
        />
      </SidePanel>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        text={deleteDialogText}
      />

    </div>
  )
}