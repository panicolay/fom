import { supabase } from '../lib/supabase'
import { Song, SongFormData } from '../types/songTypes'

export const songService = {
  /**
   * Crée une nouvelle chanson dans la base de données
   * @param songData Les données de la chanson à créer
   * @returns La chanson créée
   * @throws Error si la création échoue ou si aucune donnée n'est retournée
   */
  async create(songData: SongFormData): Promise<Song> {
    const { data, error } = await supabase
      .from('songs')
      .insert([songData])
      .select()
      .single()
    
    if (error) throw error
    if (!data) throw new Error('No data returned from create operation')
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
   * @throws Error si la mise à jour échoue ou si aucune donnée n'est retournée
   */
  async update(id: string, songData: SongFormData): Promise<Song> {
    const { data, error } = await supabase
      .from('songs')
      .update(songData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    if (!data) throw new Error('No data returned from update operation')
    return data
  },

  /**
   * Supprime une chanson et toutes ses pistes associées
   * @param id Identifiant de la chanson à supprimer
   * @returns La chanson supprimée
   */
  async delete(id: string): Promise<Song> {
    console.log('Début de la suppression de la chanson:', id)

    // D'abord, vérifier si la chanson existe
    const { data: existingSong, error: checkError } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()

    if (checkError) {
      console.error('Erreur lors de la vérification de la chanson:', checkError)
      throw checkError
    }

    if (!existingSong) {
      console.error('La chanson n\'existe pas:', id)
      throw new Error('Song not found')
    }

    console.log('Suppression des tracks associées...')
    // Supprimer toutes les tracks associées
    const { data: deletedTracks, error: deleteTracksError } = await supabase
      .from('tracks')
      .delete()
      .eq('song_id', id)
      .select()

    if (deleteTracksError) {
      console.error('Erreur lors de la suppression des tracks:', deleteTracksError)
      throw deleteTracksError
    }

    console.log('Tracks supprimées:', deletedTracks?.length || 0, 'tracks')

    console.log('Suppression de la chanson...')
    // Ensuite, supprimer la chanson
    const { data, error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erreur lors de la suppression de la chanson:', error)
      throw error
    }

    if (!data) {
      console.error('Aucune donnée retournée après la suppression')
      throw new Error('No data returned from delete operation')
    }

    console.log('Chanson supprimée avec succès:', data)
    return data
  }
} 