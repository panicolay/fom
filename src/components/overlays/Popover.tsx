import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react'

type Props = {
    name: string
    isOpen: boolean
    onClose: () => void 
    children: React.ReactNode
    anchorElement?: HTMLElement | null
    className?: string
    width: number
}

export function Popover({ name, isOpen, onClose, children, anchorElement, className, width }: Props) {
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect()
            const windowWidth = window.innerWidth
            
            let left = rect.left + window.scrollX
            
            if (left + width > windowWidth) {
                left = windowWidth - width - 16
            }

            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: left
            })
        }
    }, [anchorElement, isOpen, width])

    return (
        <Dialog 
            data-overlay={name} 
            open={isOpen} 
            onClose={onClose} 
            className="fixed inset-0 z-50"
        >
            <DialogPanel 
                transition
                style={{
                    position: 'absolute',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                className={`
                    bg-base-900 border border-base-700 ${className}
                    data-[closed]:scale-98 data-[closed]:opacity-0 duration-160
                `}
            >
                {children}
            </DialogPanel>
        </Dialog>
    )
}