// api/getOrganIcons.ts
import { supabase } from '@/lib/supabase'

export async function getOrganIcons() {
  const { data: files, error } = await supabase.storage
    .from('anatomy')
    .list('organs', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (error) {
    console.error('Error fetching organ icons:', error)
    throw error
  }

  const svgFiles = files?.filter(file => file.name.endsWith('.svg')) || []

  const icons = await Promise.all(
    svgFiles.map(async (file) => {
      const { data, error: signedError } = await supabase.storage
        .from('anatomy')
        .createSignedUrl(`organs/${file.name}`, 60 * 60 * 24 * 7) // 7 days

      if (signedError || !data) {
        console.warn(`Failed to generate signed URL for ${file.name}`, signedError)
        return null
      }

      return {
        id: file.id,
        name: file.name.replace('.svg', '').replace(/-/g, ' '), // Human-readable
        url: data.signedUrl,
        size: file.metadata?.size,
        mimetype: file.metadata?.mimetype,
      }
    })
  )

  return icons.filter(Boolean) // Remove failed ones
}