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
                fixed inset-0 bg-base-950/40 transition ease-in-out duration-160
                data-[closed]:opacity-0" />
            
            {/* Panel - add max-w-md to the panel? */} 
            <div className="fixed inset-0">
                <DialogPanel transition className="fixed inset-y-0 right-0 w-100 bg-base-900 border-l border-base-700
                    data-[closed]:translate-x-full duration-160">
                    <DialogTitle className="px-6 pt-28 pb-[calc(theme(spacing.6)_-_1px)]
                        border-b border-base-700
                        font-medium font-display uppercase text-4xl text-base-200">
                        {title}
                    </DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}