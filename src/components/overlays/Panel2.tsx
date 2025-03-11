import { Dialog, DialogPanel } from '@headlessui/react'

type Props = {
    name: string
    isOpen: boolean
    onClose: () => void 
    children: React.ReactNode
}

export function Panel2({ name, isOpen, onClose, children }: Props) {
    return (
        <Dialog data-overlay={name} open={isOpen} onClose={onClose} className="relative z-50">
            <DialogPanel transition className="fixed bottom-4 right-4 w-100 bg-neutral-900 border border-neutral-500
                data-[closed]:opacity-0 data-[closed]:scale-96 duration-200">
                {children}
            </DialogPanel>
        </Dialog>
    )
}