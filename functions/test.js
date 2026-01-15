/**
 * Função de Teste - Cloudflare Pages
 * Endpoint: GET /test
 *
 * Esta função serve para testar se as Functions estão a funcionar
 */

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      success: true,
      message: '✅ Cloudflare Pages Functions está a funcionar!',
      timestamp: new Date().toISOString(),
      environment: {
        hasResendKey: typeof Deno !== 'undefined' ? 'Checking env...' : 'Not in Cloudflare'
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
