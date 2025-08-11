
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

    const { action, ...payload } = await req.json();
    console.log('Received action:', action, 'with payload:', payload);

    switch (action) {
      case 'initiate_payment':
        return await initiatePayment(supabase, payload);
      case 'check_status':
        return await checkPaymentStatus(supabase, payload.transaction_id);
      default:
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Invalid action',
            code: 'INVALID_ACTION'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        code: 'SERVER_ERROR',
        details: 'Erreur lors du traitement de la demande'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

let tokenCache = { token: null, expiresAt: 0 };

async function fetchAccessToken() {
  console.log('Getting Semoa access token...');
  
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now) {
    console.log('Using cached token');
    return tokenCache.token;
  }

  // Utiliser les secrets Supabase
  const SEMOA_CONFIG = {
    client_id: Deno.env.get('SEMOA_CLIENT_ID') || 'cashpay',
    client_secret: Deno.env.get('SEMOA_CLIENT_SECRET') || 'HpuNOm3sDOkAvd8v3UCIxiBu68634BBs',
    username: Deno.env.get('SEMOA_USERNAME') || 'api_cashpay.corner',
    password: Deno.env.get('SEMOA_PASSWORD') || 'qH5VlCDCa4',
    apikey: Deno.env.get('SEMOA_API_KEY') || 'TjpiCTZANOmeTSW7eFUHvcoJdtMAwbzrXWyA',
    baseUrl: 'https://api.semoa-payments.ovh/sandbox'
  };
  
  const tokenUrl = `${SEMOA_CONFIG.baseUrl}/oauth/token`;
  
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
    
    const token = data.access_token || data.token;
    if (!token) {
      throw new Error(`No access token in response: ${JSON.stringify(data)}`);
    }
    
    const expiresIn = parseInt(data.expires_in || '3600', 10);
    tokenCache = { 
      token, 
      expiresAt: Date.now() + expiresIn * 1000 - 5000 // 5s buffer
    };
    
    console.log('Token cached successfully, expires in:', expiresIn);
    return token;
  } catch (error) {
    console.error('Token request failed:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

async function createSemoaPayment({ phoneNumber, amount, service = "T-MONEY" }) {
  console.log('Creating Semoa payment:', { phoneNumber, amount, service });
  
  const token = await fetchAccessToken();
  
  const SEMOA_CONFIG = {
    baseUrl: 'https://api.semoa-payments.ovh/sandbox'
  };
  
  const paymentData = {
    phoneNumber,
    amount: parseInt(amount.toString(), 10),
    currency: 'XOF',
    service
  };

  console.log('Payment request data:', paymentData);

  try {
    const response = await fetch(`${SEMOA_CONFIG.baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'User-Agent': 'Cornerstone-Briques/1.0',
      },
      body: JSON.stringify(paymentData),
    });

    console.log('Payment response status:', response.status);
    console.log('Payment response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Payment response text:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse payment response:', parseError);
      responseData = { raw_response: responseText, error: 'Invalid JSON response' };
    }

    console.log('Parsed payment response data:', responseData);

    if (!response.ok) {
      throw new Error(`Payment request failed: ${response.status} - ${responseText}`);
    }

    return responseData;
  } catch (error) {
    console.error('Payment request failed:', error);
    throw new Error(`Payment creation failed: ${error.message}`);
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
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Database error: ${dbError.message}`,
          code: 'DATABASE_ERROR'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Transaction created:', transaction);

    // Obtenir le token d'accès et effectuer le paiement
    let semoaResponse;
    try {
      // Mapper les méthodes de paiement selon l'API Semoa
      const serviceMap: { [key: string]: string } = {
        'tmoney': 'T-MONEY',
        'flooz': 'FLOOZ',
        'airtel': 'AIRTEL_MONEY',
        'mtn': 'MTN_MOMO'
      };
      
      const service = serviceMap[payment_method.toLowerCase()] || 'T-MONEY';
      
      semoaResponse = await createSemoaPayment({
        phoneNumber: phone_number,
        amount: parseFloat(amount),
        service: service
      });

      console.log('Semoa payment created successfully:', semoaResponse);

      // Logger l'appel API
      await supabase.from('semoa_api_logs').insert({
        transaction_id: transaction.id,
        endpoint: '/v1/payments',
        request_data: { phoneNumber: phone_number, amount: parseFloat(amount), service },
        response_data: semoaResponse,
        status_code: 200
      });

    } catch (semoaError) {
      console.error('Semoa error:', semoaError);
      
      // Logger l'erreur
      await supabase.from('semoa_api_logs').insert({
        transaction_id: transaction.id,
        endpoint: '/v1/payments',
        request_data: { phoneNumber: phone_number, amount: parseFloat(amount) },
        response_data: { error: semoaError.message },
        status_code: 500
      });
      
      // Mettre à jour le statut de la transaction
      await supabase
        .from('semoa_transactions')
        .update({ 
          status: 'failed', 
          semoa_response: { error: semoaError.message },
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Erreur lors de l\'appel à Semoa',
          code: 'SEMOA_ERROR',
          details: semoaError.message
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Mettre à jour la transaction avec la réponse Semoa
    const semoaOrderNum = semoaResponse.orderNum || semoaResponse.order_number || semoaResponse.reference || semoaResponse.id;
    const semoaStatus = (semoaResponse.state === 4 || semoaResponse.status === 'success') ? 'completed' : 'processing';

    await supabase
      .from('semoa_transactions')
      .update({ 
        transaction_id: semoaOrderNum,
        semoa_response: semoaResponse,
        status: semoaStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: { ...transaction, semoa_response: semoaResponse, status: semoaStatus },
        message: 'Paiement initié avec succès'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Payment error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        code: 'UNEXPECTED_ERROR'
      }),
      { 
        status: 200, 
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
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Transaction not found',
          code: 'NOT_FOUND'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Si on a un transaction_id Semoa, on peut potentiellement vérifier le statut
    // Pour l'instant, on retourne juste le statut local
    return new Response(
      JSON.stringify({ 
        success: true,
        transaction
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        code: 'STATUS_ERROR'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
