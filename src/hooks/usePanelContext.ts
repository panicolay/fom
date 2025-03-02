import { useContext } from 'react'
import { PanelContext } from '../contexts/PanelContext'

export function usePanelContext() {
    const context = useContext(PanelContext)
    if (!context) {
        throw new Error('usePanelContext must be used within a Panel')
    }
    return context
} 