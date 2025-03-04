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
     * @throws Error si la création échoue ou si aucune donnée n'est retournée
     */
    async create(trackData: TrackFormData): Promise<Track> {
        const { data, error } = await supabase
            .from('tracks')
            .insert([trackData])
            .select()
            .single()
            
        if (error) throw error
        if (!data) throw new Error('No data returned from create operation')
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
     * @throws Error si la récupération échoue ou si aucune donnée n'est retournée
     */
    async getTracksBySongId(songId: string): Promise<Track[]> {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('song_id', songId)
            .order('position', { ascending: true })
            
        if (error) throw error
        if (!data) throw new Error('No data returned from getTracksBySongId operation')
        return data
    },

    /**
     * Met à jour une piste existante
     * @param id Identifiant de la piste à mettre à jour
     * @param trackData Nouvelles données de la piste
     * @returns La piste mise à jour
     * @throws Error si la mise à jour échoue ou si aucune donnée n'est retournée
     */
    async update(id: string, trackData: TrackFormData): Promise<Track> {
        const { data, error } = await supabase
            .from('tracks')
            .update(trackData)
            .eq('id', id)
            .select()
            .single()
            
        if (error) throw error
        if (!data) throw new Error('No data returned from update operation')
        return data
    },

    /**
     * Supprime une piste et réorganise les positions des pistes restantes
     * @param id Identifiant de la piste à supprimer
     * @returns La piste supprimée
     */
    async delete(id: string): Promise<Track> {
        // D'abord, récupérer la track à supprimer pour avoir son song_id et sa position
        const { data: trackToDelete, error: getError } = await supabase
            .from('tracks')
            .select('*')
            .eq('id', id)
            .single();

        if (getError) throw getError;
        if (!trackToDelete) throw new Error('Track not found');

        // Supprimer la track
        const { data: deletedTrack, error: deleteError } = await supabase
            .from('tracks')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (deleteError) throw deleteError;
        if (!deletedTrack) throw new Error('No data returned from delete operation');

        // Récupérer toutes les tracks restantes de la même chanson avec une position supérieure
        const { data: tracksToUpdate, error: getTracksError } = await supabase
            .from('tracks')
            .select('*')
            .eq('song_id', trackToDelete.song_id)
            .gt('position', trackToDelete.position)
            .order('position', { ascending: true });

        if (getTracksError) throw getTracksError;
        if (!tracksToUpdate) return deletedTrack;

        // Mettre à jour les positions si nécessaire
        if (tracksToUpdate.length > 0) {
            const updatedTracks = tracksToUpdate.map((track, index) => ({
                ...track,
                position: trackToDelete.position + index
            }));

            await this.updatePositions(updatedTracks);
        }

        return deletedTrack;
    },

    /**
     * Met à jour les positions des pistes
     * @param tracks Liste des pistes à mettre à jour
     * @returns Les pistes mises à jour
     */
    async updatePositions(tracks: Track[]): Promise<Track[]> {
        const updates = tracks.map(track => ({
            id: track.id,
            position: track.position,
            name: track.name,
            song_id: track.song_id
        }));
        
        const { data, error } = await supabase
            .from('tracks')
            .upsert(updates, { 
                onConflict: 'id',
                ignoreDuplicates: false 
            })
            .select();
            
        if (error) throw error;
        if (!data) throw new Error('No data returned from updatePositions operation')
        return data;
    }
}
