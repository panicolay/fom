import { Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'
import { Button } from '../buttons/Button'

type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    text: string
}

export function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    text
}: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop transition className="
                fixed inset-0 bg-base-950/40 transition ease-in-out duration-160
                data-[closed]:opacity-0" />

            <div className="fixed inset-0 flex justify-center pt-28">
                <DialogPanel
                    transition
                    className="
                        w-100 self-start
                        bg-base-900 border border-base-700
                        text-base-200
                        data-[closed]:opacity-0 data-[closed]:-translate-y-4
                        duration-160"
                >
                    <div className="p-6">
                        <DialogTitle
                            className="
                                mb-4
                                text-sm text-base-400 font-display uppercase">
                            {title}
                        </DialogTitle>
                        <div className="">{text}</div>
                    </div>
                    <div className="flex">
                        <Button
                            variant="panelGhost"
                            className="w-full h-14 border-t border-r border-base-700"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="panelGhostDanger"
                            className="w-full h-14 border-t border-base-700"
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