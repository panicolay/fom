import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Button } from '../buttons/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  text: string
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title, text }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="
                fixed inset-0 bg-base-950/80 transition ease-in-out duration-160
                data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex justify-center pt-24">
        <DialogPanel
          transition
          className="
                        w-100 self-start
                        bg-base-900 border border-base-700
                        text-base-200
                        data-[closed]:opacity-0 data-[closed]:-translate-y-4
                        duration-160"
        >
          <div className="flex flex-col p-4 gap-2">
            <DialogTitle
              className="
                                text-sm text-base-400 font-display uppercase"
            >
              {title}
            </DialogTitle>
            <div className="">{text}</div>
          </div>
          <div className="flex h-12">
            <Button
              variant="panelGhost"
              className="w-full border-t border-r border-base-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="panelGhostDanger"
              className="w-full border-t border-base-700"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
