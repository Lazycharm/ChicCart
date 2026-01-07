import { supabase } from '@/lib/supabaseClient';

/**
 * Upload a file to Supabase Storage
 * This replaces Base44's file upload functionality
 */
export async function uploadFile(file: File, bucket: string = 'products') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    file_url: publicUrl,
    file_path: filePath
  };
}

