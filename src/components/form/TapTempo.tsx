import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'

type Props = {
  onBpmChange: (bpm: number) => void
  className?: string
}

export function TapTempo({ onBpmChange, className }: Props) {
  const [tapTimes, setTapTimes] = useState<number[]>([])
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (tapTimeout) clearTimeout(tapTimeout)
    }
  }, [tapTimeout])

  const handleTap = () => {
    const currentTime = Date.now()
    const newTapTimes = [...tapTimes, currentTime]
    
    if (tapTimeout) clearTimeout(tapTimeout)
    
    const timeout = setTimeout(() => {
      setTapTimes([])
    }, 2000)
    
    setTapTimeout(timeout)
    setTapTimes(newTapTimes)

    if (newTapTimes.length >= 4) {
      const intervals = []
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1])
      }
      
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const bpmValue = Math.round(60000 / averageInterval)
      onBpmChange(bpmValue)
    }
  }

  return (
    <Button 
      size="small" 
      variant="secondary" 
      onClick={handleTap}
      type="button"
      className={className}
    >
      Tap
    </Button>
  )
} 