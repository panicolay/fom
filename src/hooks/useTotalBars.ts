import { useMemo } from 'react'
import { calculateTotalBars } from '../utils/structureUtils'
import { Structure } from '../types/structureTypes'

export function useTotalBars(structure: Structure | undefined) {
  const bars = useMemo(() => {
    if (!structure) return 0

    const { length, bpm, time_signature } = structure

    const totalBars = calculateTotalBars(Number(length), Number(bpm), time_signature)

    return totalBars
  }, [structure])

  return bars
}