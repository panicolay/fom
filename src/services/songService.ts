import { supabase } from '../lib/supabase'
import type { Song } from '../types/song'

type CreateSongData = {
  title: string
  artist?: string
  album?: string
  bpm?: number | null
  length?: number | null
  time_signature?: string
  key?: string
}

export const songService = {
  async create(songData: CreateSongData) {
    const { data, error } = await supabase
      .from('songs')
      .insert([songData])
    
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
} 