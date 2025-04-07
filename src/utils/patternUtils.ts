import { Pattern, TimeLineItem } from '../types/patternTypes'

export function generatePatternTimeline(patterns: Pattern[], totalBars: number): TimeLineItem[] {
  if (totalBars <= 0) throw new Error('Total bars must be positive')
  if (!Array.isArray(patterns)) throw new Error('Patterns must be an array')

  // Initialiser la timeline avec des null pour toutes les mesures
  let timeline: TimeLineItem[] = []

  // Trier les patterns par position de début
  const sortedPatterns = [...patterns].sort((a, b) => a.start - b.start)

  // Remplir la timeline
  let currentPosition = 0

  while (currentPosition < totalBars) {
    const pattern = sortedPatterns.find((p) => p.start === currentPosition)

    if (pattern) {
      timeline.push(pattern)
      currentPosition += pattern.total_length
    } else {
      timeline.push({ type: 'empty', start: currentPosition })
      currentPosition++
    }
  }

  return timeline
}
