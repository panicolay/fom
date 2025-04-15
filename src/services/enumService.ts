import { supabase } from '../lib/supabase'

export const enumService = {
  /**
   * Get the values of an enum from Supabase
   * @param enumName The name of the enum in Supabase
   * @returns An array of the possible values of the enum
   */
  async getEnumValues(enumName: string): Promise<string[]> {
    const { data, error } = await supabase
      .rpc('get_enum_values', { enum_name: enumName })

    if (error) throw error
    return data || []
  }
} 