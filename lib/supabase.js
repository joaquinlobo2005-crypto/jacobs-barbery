import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dubddgmeatuqlsucotsp.supabase.co'
const supabaseKey = 'sb_publishable_ELCeL30LQ3Nv1spll2bpuw_m8O_heUt'

export const supabase = createClient(supabaseUrl, supabaseKey)