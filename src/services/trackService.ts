import { supabase } from '../lib/supabase'
import { Track, TrackFormData } from '../types/trackTypes'

export const trackService = {
    /**
     * Obtient la position maximale actuelle pour une chanson donnée
     * @param songId Identifiant de la chanson
     * @returns La position maximale ou 0 si aucune track n'existe
     */
    async getMaxPosition(songId: string): Promise<number> {
        const { data, error } = await supabase
            .from('tracks')
            .select('position')
            .eq('song_id', songId)
            .order('position', { ascending: false })
            .limit(1)
            
        if (error) throw error
        return data && data.length > 0 ? data[0].position : 0
    },

    /**
     * Crée une nouvelle piste dans la base de données
     * @param trackData Les données de la piste à créer
     * @returns La piste créée
     */
    async create(trackData: TrackFormData): Promise<Track[] | null> {
        // Obtenir la position maximale actuelle et ajouter 1
        const maxPosition = await this.getMaxPosition(trackData.song_id)
        const dataWithPosition = {
            ...trackData,
            position: maxPosition + 1
        }

        const { data, error } = await supabase
            .from('tracks')
            .insert([dataWithPosition])
            
        if (error) throw error
        return data
    },

    /**
     * Récupère toutes les pistes, triées par date de création décroissante
     * @returns Liste des pistes
     */
    async getAll(): Promise<Track[] | null> {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (error) throw error
        return data
    },

    /**
     * Récupère une piste par son identifiant
     * @param id Identifiant de la piste
     * @returns La piste trouvée ou null
     */
    async getById(id: string): Promise<Track | null> {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('id', id)
            .single()
            
        if (error) throw error
        return data
    },

    /**
     * Récupère toutes les pistes d'une chanson
     * @param songId Identifiant de la chanson
     * @returns Liste des pistes de la chanson
     */
    async getTracksBySongId(songId: string): Promise<Track[] | null> {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('song_id', songId)
            .order('position', { ascending: true })
            
        if (error) throw error
        return data
    },

    /**
     * Met à jour une piste existante
     * @param id Identifiant de la piste à mettre à jour
     * @param trackData Nouvelles données de la piste
     * @returns La piste mise à jour
     */
    async update(id: string, trackData: TrackFormData): Promise<Track[] | null> {
        const { data, error } = await supabase
            .from('tracks')
            .update(trackData)
            .eq('id', id)
            .select()
            
        if (error) throw error
        return data
    },

    /**
     * Supprime une piste
     * @param id Identifiant de la piste à supprimer
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('tracks')
            .delete()
            .eq('id', id)
            
        if (error) throw error
    }
}
