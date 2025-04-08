import { supabase } from '../lib/supabase'
import { Track, TrackFormData } from '../types/trackTypes'

export const trackService = {
  /**
   * Create a new track in the database
   * @param trackData The data of the track to create
   * @returns The created track
   * @throws Error if the creation fails or if no data is returned
   */
  async create(trackData: TrackFormData): Promise<Track> {
    const { data, error } = await supabase.from('tracks').insert([trackData]).select().single()

    if (error) throw error
    if (!data) throw new Error('No data returned from create operation')
    return data
  },

  /**
   * Get all tracks of a structure
   * @param structureId The id of the structure
   * @returns List of tracks of the structure
   * @throws Error if the retrieval fails
   */
  async getTracksByStructureId(structureId: string): Promise<Track[]> {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('structure_id', structureId)
      .order('position', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * Get a track by its id
   * @param id The id of the track
   * @returns The found track or null
   */
  async getById(id: string): Promise<Track | null> {
    const { data, error } = await supabase.from('tracks').select('*').eq('id', id).single()

    if (error) throw error
    return data
  },

  /**
   * Update an existing track
   * @param id The id of the track to update
   * @param trackData New data of the track
   * @returns The updated track
   * @throws Error if the update fails or if no data is returned
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
   * Delete a track
   * @param id The id of the track to delete
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tracks').delete().eq('id', id)

    if (error) throw error
  },

  /**
   * Get the maximum position for a structure
   * @param structureId The id of the structure
   * @returns The maximum position or 0 if no track exists
   */
  async getMaxPosition(structureId: string): Promise<number> {
    const { data, error } = await supabase
      .from('tracks')
      .select('position')
      .eq('structure_id', structureId)
      .order('position', { ascending: false })
      .limit(1)

    if (error) throw error
    return data && data.length > 0 ? data[0].position : 0
  },

  /**
   * Update the positions of the tracks
   * @param tracks List of tracks to update
   */
  async updatePositions(tracks: Track[]): Promise<void> {
    if (tracks.length === 0) return

    const updates = tracks.map((track) => ({
      id: track.id,
      position: track.position,
      name: track.name,
      structure_id: track.structure_id,
    }))

    const { error } = await supabase.from('tracks').upsert(updates, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })

    if (error) throw error
  },
}
