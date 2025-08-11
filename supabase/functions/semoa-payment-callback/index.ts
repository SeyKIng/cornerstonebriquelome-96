
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json();
    console.log('Received Semoa callback:', payload);

    // Logger le callback reçu
    await supabase.from('semoa_api_logs').insert({
      endpoint: '/callback',
      request_data: payload,
      response_data: { received: true },
      status_code: 200
    });

    // Extraire l'ID de référence de la transaction
    const reference = payload.reference || payload.transaction_id || payload.id;
    
    if (reference) {
      // Rechercher la transaction correspondante
      const { data: transaction, error } = await supabase
        .from('semoa_transactions')
        .select('*')
        .eq('id', reference)
        .single();

      if (transaction && !error) {
        // Déterminer le nouveau statut basé sur la réponse Semoa
        let newStatus = 'processing';
        
        if (payload.status === 'completed' || payload.status === 'success' || payload.state === 4) {
          newStatus = 'completed';
        } else if (payload.status === 'failed' || payload.status === 'cancelled' || payload.state === 5) {
          newStatus = 'failed';
        }

        // Mettre à jour la transaction
        await supabase
          .from('semoa_transactions')
          .update({
            status: newStatus,
            semoa_response: payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', reference);

        console.log(`Transaction ${reference} updated to status: ${newStatus}`);
      }
    }

    return new Response(
      JSON.stringify({ received: true, status: 'OK' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Callback error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        received: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
