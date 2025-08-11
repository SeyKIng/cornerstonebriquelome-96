
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SEMOA_CONFIG = {
  client_id: 'cashpay',
  client_secret: 'HpuNOm3sDOkAvd8v3UCIxiBu68634BBs',
  username: 'api_cashpay.corner',
  password: 'qH5VlCDCa4',
  apikey: 'TjpiCTZANOmeTSW7eFUHvcoJdtMAwbzrXWyA',
  baseUrl: 'https://api.semoa-payments.ovh/sandbox'
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

    const { action, ...payload } = await req.json();
    console.log('Received action:', action, 'with payload:', payload);

    switch (action) {
      case 'initiate_payment':
        return await initiatePayment(supabase, payload);
      case 'check_status':
        return await checkPaymentStatus(supabase, payload.transaction_id);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Erreur lors du traitement de la demande'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getAccessToken() {
  console.log('Getting Semoa access token...');
  
  const tokenUrl = `${SEMOA_CONFIG.baseUrl}/oauth/token`;
  
  // Préparer les données pour l'authentification en utilisant application/x-www-form-urlencoded
  const authParams = new URLSearchParams({
    grant_type: 'password',
    client_id: SEMOA_CONFIG.client_id,
    client_secret: SEMOA_CONFIG.client_secret,
    username: SEMOA_CONFIG.username,
    password: SEMOA_CONFIG.password,
  });

  console.log('Token request URL:', tokenUrl);
  console.log('Auth params:', authParams.toString());

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-KEY': SEMOA_CONFIG.apikey,
        'Accept': 'application/json',
        'User-Agent': 'Cornerstone-Briques/1.0',
      },
      body: authParams.toString(),
    });

    console.log('Token response status:', response.status);
    console.log('Token response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Token response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse token response:', parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    console.log('Parsed token data:', data);
    
    if (!data.access_token) {
      throw new Error(`No access token in response: ${JSON.stringify(data)}`);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Token request failed:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

async function initiatePayment(supabase: any, payload: any) {
  const { amount, phone_number, payment_method, order_summary, user_id } = payload;
  console.log('Initiating payment with:', { amount, phone_number, payment_method });

  try {
    // Enregistrer la transaction dans la base de données
    const { data: transaction, error: dbError } = await supabase
      .from('semoa_transactions')
      .insert({
        user_id: user_id || null,
        amount: parseFloat(amount),
        phone_number,
        payment_method,
        order_summary,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Transaction created:', transaction);

    // Obtenir le token d'accès
    const accessToken = await getAccessToken();
    console.log('Got access token successfully');
    
    // Mapper les méthodes de paiement selon l'API Semoa
    const providerMap: { [key: string]: string } = {
      'tmoney': 'TMONEY',
      'flooz': 'FLOOZ',
      'airtel': 'AIRTEL_MONEY',
      'mtn': 'MTN_MOMO'
    };
    
    const provider = providerMap[payment_method.toLowerCase()] || 'TMONEY';
    
    // Préparer les données de paiement selon l'API Semoa
    const paymentData = {
      amount: parseFloat(amount),
      currency: 'XOF',
      phone: phone_number,
      provider: provider,
      reference: transaction.id,
      description: `Commande Cornerstone Briques - ${transaction.id.substring(0, 8)}`,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/semoa-payment-callback`,
      return_url: `${Deno.env.get('SUPABASE_URL')}/paiement/success`
    };

    console.log('Payment request data:', paymentData);

    // Effectuer l'appel à l'API Semoa
    const paymentResponse = await fetch(`${SEMOA_CONFIG.baseUrl}/payment/mobile-money`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-API-KEY': SEMOA_CONFIG.apikey,
        'Accept': 'application/json',
        'User-Agent': 'Cornerstone-Briques/1.0',
      },
      body: JSON.stringify(paymentData),
    });

    console.log('Payment response status:', paymentResponse.status);
    console.log('Payment response headers:', Object.fromEntries(paymentResponse.headers.entries()));
    
    const responseText = await paymentResponse.text();
    console.log('Payment response text:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse payment response:', parseError);
      responseData = { raw_response: responseText, error: 'Invalid JSON response' };
    }

    console.log('Parsed payment response data:', responseData);

    // Logger l'appel API
    await supabase.from('semoa_api_logs').insert({
      transaction_id: transaction.id,
      endpoint: '/payment/mobile-money',
      request_data: paymentData,
      response_data: responseData,
      status_code: paymentResponse.status
    });

    if (!paymentResponse.ok) {
      // Mettre à jour le statut de la transaction
      await supabase
        .from('semoa_transactions')
        .update({ 
          status: 'failed', 
          semoa_response: responseData,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      throw new Error(`Payment initiation failed: ${responseData.message || responseData.error || responseText}`);
    }

    // Mettre à jour la transaction avec la réponse Semoa
    await supabase
      .from('semoa_transactions')
      .update({ 
        transaction_id: responseData.transaction_id || responseData.id || responseData.reference,
        semoa_response: responseData,
        status: responseData.status || 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: { ...transaction, semoa_response: responseData },
        message: 'Paiement initié avec succès'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Payment error:', error);
    
    // Mettre à jour le statut en cas d'erreur si la transaction existe
    if (payload.transaction_id) {
      try {
        await supabase
          .from('semoa_transactions')
          .update({ 
            status: 'failed',
            semoa_response: { error: error.message },
            updated_at: new Date().toISOString()
          })
          .eq('id', payload.transaction_id);
      } catch (updateError) {
        console.error('Failed to update transaction status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function checkPaymentStatus(supabase: any, transactionId: string) {
  console.log('Checking payment status for:', transactionId);

  try {
    const { data: transaction, error } = await supabase
      .from('semoa_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      console.error('Transaction not found:', error);
      throw new Error('Transaction not found');
    }

    // Si on a un transaction_id Semoa, vérifier le statut
    if (transaction.transaction_id) {
      try {
        const accessToken = await getAccessToken();
        
        const statusResponse = await fetch(`${SEMOA_CONFIG.baseUrl}/payment/status/${transaction.transaction_id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-API-KEY': SEMOA_CONFIG.apikey,
            'Accept': 'application/json',
            'User-Agent': 'Cornerstone-Briques/1.0',
          },
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('Status response:', statusData);
          
          // Mettre à jour le statut si nécessaire
          if (statusData.status && statusData.status !== transaction.status) {
            await supabase
              .from('semoa_transactions')
              .update({ 
                status: statusData.status,
                semoa_response: { ...transaction.semoa_response, ...statusData },
                updated_at: new Date().toISOString()
              })
              .eq('id', transaction.id);
            
            transaction.status = statusData.status;
            transaction.semoa_response = { ...transaction.semoa_response, ...statusData };
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        transaction,
        success: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
