import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

type Props = {
    isOpen: boolean
    onClose: () => void
    title: React.ReactNode
    children: React.ReactNode
}

export function Panel({ isOpen, onClose, title, children }: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">

            {/* Background */}
            <DialogBackdrop transition className="
                fixed inset-0 bg-neutral-950/56 transition ease-in-out duration-160
                data-[closed]:opacity-0" />
            
            {/* Panel - add max-w-md to the panel? */} 
            <div className="fixed inset-0">
                <DialogPanel transition className="fixed inset-y-0 right-0 w-100 bg-neutral-900 border-l border-neutral-500
                    data-[closed]:translate-x-full duration-200">
                    <DialogTitle className="p-6 border-b border-neutral-500
                        font-display uppercase text-4xl font-medium text-neutral-300">
                        {title}
                    </DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}