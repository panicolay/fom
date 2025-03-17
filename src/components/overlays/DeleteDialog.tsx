import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import { Button } from '../buttons/Button'

type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    text: string
}

export function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    text
}: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop transition className="
                fixed inset-0 bg-base-950/40 transition ease-in-out duration-160
                data-[closed]:opacity-0" />

            <div className="fixed inset-0 flex justify-center pt-28">
                <DialogPanel
                    className="
                        w-80 self-start
                        bg-base-900 border border-base-700
                        text-base-200"
                >
                    <div className="p-4">{text}</div>
                    <div className="flex">
                        <Button
                            variant="panelDefault"
                            className="w-full h-14 border-t border-r border-base-700"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="panelDefault"
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