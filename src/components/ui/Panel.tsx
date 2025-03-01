import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'


type Props = {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  side: 'right' | 'left'
}

export function Panel({ isOpen, onClose, title, children, side }: Props) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div"
        className="relative z-50" 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-160"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-160"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-950/56" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className={`fixed inset-y-0 max-w-md ${side === 'right' ? 'right-0' : 'left-0'}`}>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200"
              enterFrom={side === 'right' ? 'translate-x-full' : '-translate-x-full'}
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo={side === 'right' ? 'translate-x-full' : '-translate-x-full'}
            >
              <Dialog.Panel 
                className={`h-full w-screen max-w-md ${
                  side === 'left' ? 'border-r' : 'border-l'
                } border-neutral-500 bg-neutral-900`}
              >
                <div className="flex h-full flex-col">
                  <Dialog.Title 
                    className="font-display uppercase text-4xl font-medium text-neutral-300 p-6 border-b border-neutral-500"
                  >
                    {title}
                  </Dialog.Title>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}