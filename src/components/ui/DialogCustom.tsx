import { Dialog } from '@headlessui/react'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function DialogCustom({ isOpen, onClose, title, children }: Props) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
      initialFocus={undefined}
    >
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col bg-neutral-950 w-full max-w-md relative">
            <Dialog.Title className="text-lg font-bold text-neutral-200">{title}</Dialog.Title>
            {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}