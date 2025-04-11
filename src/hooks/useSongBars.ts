import { useMemo } from 'react'
import { calculateTotalBars } from '../utils/songUtils'
import { Structure } from '../types/structureTypes'

export function useSongBars(Structure: Structure | undefined) {
  const bars = useMemo(() => {
    if (!Structure) return 0

    const { length, bpm, time_signature } = Structure

    const totalBars = calculateTotalBars(Number(length), Number(bpm), time_signature)

    return totalBars
  }, [Structure])

  return bars
}
