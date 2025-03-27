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
import { useNavigate } from 'react-router-dom'
import { KEYBOARD_SHORTCUTS } from '../utils/shortcuts'

type DeletableItem =
  | { type: 'structure', data: Structure }
  | { type: 'track', data: Track }

export function RootLayout() {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
  const [structureToEdit, setStructureToEdit] = useState<Structure | null>(null)
  const [isStructureFormOpen, setIsStructureFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteDialogText, setDeleteDialogText] = useState('')
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('')
  const [itemToDelete, setItemToDelete] = useState<DeletableItem | null>(null)
  const { deleteStructure } = useStructureMutation()
  const { deleteTrack } = useTrackMutation()
  const navigate = useNavigate()

  useEffect(() => {
    registerShortcut('openStructureForm', { key: KEYBOARD_SHORTCUTS.NEW_STRUCTURE }, () => {
      handleStructureFormOpen()
    })
    return () => unregisterShortcut('openStructureForm')
  }, [registerShortcut, unregisterShortcut])

  const handleStructureFormOpen = (structure?: Structure) => {
    setStructureToEdit(structure || null)
    setIsStructureFormOpen(true)
  }

  const handleStructureFormClose = () => {
    setIsStructureFormOpen(false)
  }

  const handleDeleteStructure = (structure: Structure, text: string) => {
    setItemToDelete({ type: 'structure', data: structure })
    setDeleteDialogTitle('delete structure')
    setDeleteDialogText(text)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTrack = (track: Track, text: string) => {
    setItemToDelete({ type: 'track', data: track })
    setDeleteDialogTitle('delete track')
    setDeleteDialogText(text)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
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
      if (itemToDelete.type === 'structure') {
        navigate('/')
      }
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
        title={deleteDialogTitle}
        text={deleteDialogText}
      />

    </div>
  )
}