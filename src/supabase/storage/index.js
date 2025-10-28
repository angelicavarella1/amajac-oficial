// C:\Users\angel\Documents\Projetos\amajac-oficial\src\supabase\storage\index.js

import { supabase } from '../client';

// MANTENHA SOMENTE ESTA EXPORTACAO:
export const storageApi = {
  uploadFile: async (bucketName, filePath, file, options = {}) => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { ...options, upsert: true });
    if (error) throw error;
    return data;
  },

  deleteFile: async (bucketName, filePath) => {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    if (error) throw error;
    return true;
  },

  getPublicUrl: (bucketName, filePath) => {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    return data.publicUrl;
  },
};

// NAO TENHA NENHUM 'export { storageApi }' ADICIONAL AQUI!
// NAO TENHA NENHUM 'export default storageApi' AQUI se voce quer a exportacao nomeada!