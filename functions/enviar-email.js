/**
 * Cloudflare Pages Function - Envio de Email via Resend
 *
 * Esta função serverless processa os formulários de contacto e orçamentos
 * e envia emails usando a API do Resend.
 *
 * Setup:
 * 1. Criar conta em resend.com
 * 2. Gerar API Key
 * 3. Configurar variável de ambiente RESEND_API_KEY no Cloudflare Pages
 *
 * Endpoint: POST /enviar-email
 */

export async function onRequestPost(context) {
  // Log para debugging (aparece nos Real-time Logs do Cloudflare)
  console.log('[enviar-email] Function called at:', new Date().toISOString());

  try {
    // Parse do corpo da requisição
    const data = await context.request.json();
    console.log('[enviar-email] Data received:', { nome: data.nome, email: data.email, tipo: data.tipo });

    // Validar dados obrigatórios
    if (!data.nome || !data.email || !data.mensagem) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Campos obrigatórios não preenchidos'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email inválido'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Obter API Key do ambiente
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    // Log para debugging
    console.log('[enviar-email] API Key exists:', !!RESEND_API_KEY);
    console.log('[enviar-email] API Key length:', RESEND_API_KEY ? RESEND_API_KEY.length : 0);

    if (!RESEND_API_KEY) {
      console.error('[enviar-email] ERROR: RESEND_API_KEY não configurada');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Configuração de email não encontrada'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Construir corpo do email baseado no tipo de formulário
    let emailSubject = 'Novo Contacto via Website GT Móvel';
    let emailBody = '';

    if (data.tipo === 'orcamento') {
      // Formulário de Orçamento
      emailSubject = `Novo Pedido de Orçamento - ${data.tipoProduto || 'Geral'}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">GT Móvel</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Novo Pedido de Orçamento</p>
          </div>

          <div style="background: #f8f9fa; padding: 30px;">
            <div style="background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
                📋 Detalhes do Pedido
              </h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Nome:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="color: #1e293b;">${data.nome}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Email:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <a href="mailto:${data.email}" style="color: #F97316; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                ${data.telefone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Telefone:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <a href="tel:${data.telefone}" style="color: #F97316; text-decoration: none;">${data.telefone}</a>
                  </td>
                </tr>
                ` : ''}
                ${data.tipoProduto ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Tipo de Produto:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="color: #1e293b;">${data.tipoProduto}</span>
                  </td>
                </tr>
                ` : ''}
                ${data.assunto ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Assunto:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="color: #1e293b;">${data.assunto}</span>
                  </td>
                </tr>
                ` : ''}
              </table>

              <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-left: 4px solid #F97316; border-radius: 4px;">
                <strong style="color: #64748b; display: block; margin-bottom: 10px;">💬 Mensagem:</strong>
                <p style="color: #1e293b; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.mensagem}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                📧 Enviado através do formulário de orçamentos em <strong>www.gtmovel.com</strong>
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
                ${new Date().toLocaleString('pt-PT', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
          </div>
        </div>
      `;
    } else {
      // Formulário de Contacto Normal
      emailSubject = `Novo Contacto via Website - ${data.assunto || data.subject || 'Sem Assunto'}`;
      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">GT Móvel</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Novo Contacto</p>
          </div>

          <div style="background: #f8f9fa; padding: 30px;">
            <div style="background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
                📧 Informações do Contacto
              </h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Nome:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="color: #1e293b;">${data.nome || data.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Email:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <a href="mailto:${data.email}" style="color: #F97316; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                ${data.telefone || data.phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Telefone:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <a href="tel:${data.telefone || data.phone}" style="color: #F97316; text-decoration: none;">${data.telefone || data.phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${data.assunto || data.subject ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #64748b;">Assunto:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="color: #1e293b;">${data.assunto || data.subject}</span>
                  </td>
                </tr>
                ` : ''}
              </table>

              <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border-left: 4px solid #F97316; border-radius: 4px;">
                <strong style="color: #64748b; display: block; margin-bottom: 10px;">💬 Mensagem:</strong>
                <p style="color: #1e293b; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.mensagem || data.message}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                📧 Enviado através do formulário de contacto em <strong>www.gtmovel.com</strong>
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
                ${new Date().toLocaleString('pt-PT', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // Log antes de enviar
    console.log('[enviar-email] Sending to Resend API...');

    // Enviar email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GT Móvel Website <onboarding@resend.dev>', // Alterar para o domínio verificado: noreply@gtmovel.com
        to: ['guilherme.jcmarques@gmail.com'], // Email de destino
        reply_to: data.email, // Permite responder diretamente ao cliente
        subject: emailSubject,
        html: emailBody,
      }),
    });

    const responseData = await response.json();

    console.log('[enviar-email] Resend API response:', {
      status: response.status,
      ok: response.ok,
      id: responseData.id
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email enviado com sucesso!',
          id: responseData.id
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } else {
      console.error('[enviar-email] ERROR from Resend:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao enviar email. Tente novamente.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (err) {
    console.error('[enviar-email] CRITICAL ERROR:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Erro interno do servidor'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Suporte a CORS para requisições OPTIONS (preflight)
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
