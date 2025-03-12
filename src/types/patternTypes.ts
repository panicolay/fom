export interface Pattern {
  id: string
  created_at: string
  track_id: string
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
  total_length: number
}

export interface PatternFormData {
  name?: string
  comment?: string
  start: number
  length: number
  repeat: number
  track_id: string
}

export interface EmptyBar {
  type: 'empty'
  start: number
}

export type TimeLineItem = Pattern | EmptyBar

// Fonctions de garde de type
export function isPattern(item: TimeLineItem): item is Pattern {
  return !('type' in item);
}

export function isEmptyBar(item: TimeLineItem): item is EmptyBar {
  return 'type' in item && item.type === 'empty';
}