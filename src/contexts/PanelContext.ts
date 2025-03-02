import { createContext } from 'react'
import { PanelContextType } from '../types/panelTypes'

export const PanelContext = createContext<PanelContextType | null>(null) 