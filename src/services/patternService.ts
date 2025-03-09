import { supabase } from '../lib/supabase'
import { Pattern, PatternFormData } from '../types/patternTypes'

export const patternService = {
    /**
     * Crée un nouveau motif dans la base de données
     * @param patternData Les données du motif à créer
     * @returns Le motif créé
     */
    async create(patternData: PatternFormData): Promise<Pattern> {
        const { data, error } = await supabase
            .from('patterns')
            .insert([patternData])
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('No data returned from create operation')
        return data
    },

    /**
     * Récupère tous les motifs d'une piste 
     * @param trackId L'identifiant de la piste
     * @returns Tous les motifs de la piste triés par start
     */
    async getPatternsByTrackId(trackId: string): Promise<Pattern[]> {
        const { data, error } = await supabase
            .from('patterns')
            .select('*')
            .eq('track_id', trackId)
            .order('start', { ascending: true })

        if (error) throw error
        return data || []
    },

    /**
     * Récupère un motif par son identifiant
     * @param id L'identifiant du motif
     * @returns Le motif trouvé ou null
     */
    async getById(id: string): Promise<Pattern | null> {
        const { data, error } = await supabase
            .from('patterns')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Met à jour un motif existant
     * @param id L'identifiant du motif à mettre à jour
     * @param patternData Les nouvelles données du motif
     * @returns Le motif mis à jour
     */
    async update(id: string, patternData: PatternFormData): Promise<Pattern> {
        const { data, error } = await supabase
            .from('patterns')
            .update(patternData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error('No data returned from update operation')
        return data
    },
    
    /**
     * Supprime un motif existant
     * @param id L'identifiant du motif à supprimer
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('patterns')
            .delete()
            .eq('id', id)

        if (error) throw error
    }   
}