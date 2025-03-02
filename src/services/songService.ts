import { supabase } from '../lib/supabase'
import { Song, SongFormData } from '../types/songTypes'

export const songService = {
  /**
   * Crée une nouvelle chanson dans la base de données
   * @param songData Les données de la chanson à créer
   * @returns La chanson créée
   */
  async create(songData: SongFormData): Promise<Song[] | null> {
    const { data, error } = await supabase
      .from('songs')
      .insert([songData])
    
    if (error) throw error
    return data
  },

  /**
   * Récupère toutes les chansons, triées par date de création décroissante
   * @returns Liste des chansons
   */
  async getAll(): Promise<Song[] | null> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  /**
   * Récupère une chanson par son identifiant
   * @param id Identifiant de la chanson
   * @returns La chanson trouvée ou null
   */
  async getById(id: string): Promise<Song | null> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) throw error
    return data
  },

  /**
   * Met à jour une chanson existante
   * @param id Identifiant de la chanson à mettre à jour
   * @param songData Nouvelles données de la chanson
   * @returns La chanson mise à jour
   */
  async update(id: string, songData: SongFormData): Promise<Song[] | null> {
    const { data, error } = await supabase
      .from('songs')
      .update(songData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  /**
   * Supprime une chanson
   * @param id Identifiant de la chanson à supprimer
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 