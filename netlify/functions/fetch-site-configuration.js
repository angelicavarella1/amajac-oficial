import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export async function handler(event, context) {
  try {
    const { data, error } = await supabase
      .from('site_configuration') // ajuste para o nome da sua tabela
      .select('*')
      .single();

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro ao buscar configuração', error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno', error: err.message }),
    };
  }
}
