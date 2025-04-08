import { useMemo } from 'react'
import { calculateTotalBars } from '../utils/songUtils'
import { Song } from '../types/structureTypes'

export function useSongBars(song: Song | undefined) {
  const bars = useMemo(() => {
    if (!song) return 0

    const { length, bpm, time_signature } = song

    const totalBars = calculateTotalBars(Number(length), Number(bpm), time_signature)

    return totalBars
  }, [song])

  return bars
}
