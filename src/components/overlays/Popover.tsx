import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react'

type Props = {
    name: string
    isOpen: boolean
    onClose: () => void 
    children: React.ReactNode
    anchorElement?: HTMLElement | null
}

export function Popover({ name, isOpen, onClose, children, anchorElement }: Props) {
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect()
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            })
        }
    }, [anchorElement, isOpen])

    return (
        <Dialog 
            data-overlay={name} 
            open={isOpen} 
            onClose={onClose} 
            className="fixed inset-0 z-50"
        >
            <DialogPanel 
                style={{
                    position: 'absolute',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                className="w-100 bg-base-900 border border-base-700"
            >
                {children}
            </DialogPanel>
        </Dialog>
    )
}