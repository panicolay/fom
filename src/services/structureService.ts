import { supabase } from '../lib/supabase'
import { Structure, StructureFormData } from '../types/structureTypes'

export const structureService = {
  /**
   * Create a new structure in the database
   * @param structureData The data of the structure to create
   * @returns The created structure
   */
  async create(structureData: StructureFormData): Promise<Structure> {
    const { data, error } = await supabase
      .from('structures')
      .insert([structureData])
      .select()
      .single()
    
    if (error) throw error
    if (!data) throw new Error('No data returned from create operation')
    return data
  },

  /**
   * Get all structures, sorted by creation date
   * @returns List of structures
   */
  async getAll(): Promise<Structure[]> {
    const { data, error } = await supabase
      .from('structures')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  /**
   * Get a structure by its id
   * @param id The id of the structure
   * @returns The found structure or null
   */
  async getById(id: string): Promise<Structure | null> {
    const { data, error } = await supabase
      .from('structures')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) throw error
    return data
  },

  /**
   * Update an existing structure
   * @param id The id of the structure to update
   * @param structureData New data of the structure
   * @returns The updated structure
   */
  async update(id: string, structureData: StructureFormData): Promise<Structure> {
    const { data, error } = await supabase
      .from('structures')
      .update(structureData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    if (!data) throw new Error('No data returned from update operation')
    return data
  },

  /**
   * Delete a structure
   * @param id The id of the structure to delete
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('structures')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}