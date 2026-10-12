// Test-only checkout. Never grants benefits or accepts a live seller account.
const catalog = {
  destaque: { title: 'Vaga em destaque', days: 7 },
  urgente: { title: 'Vaga urgente', days: 7 },
  confidencial: { title: 'Vaga confidencial', days: 30 },
};
const base = Deno.env.get('SUPABASE_URL')!;
const admin = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const token = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_TEST');
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
async function db(path: string, init: RequestInit = {}) {
  const response = await fetch(base + '/rest/v1/' + path, {
    ...init, headers: { apikey: admin, Authorization: 'Bearer ' + admin, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Não foi possível registrar o pagamento.');
  return await response.json();
}
async function mp(path: string, init: RequestInit = {}) {
  if (!token) throw new Error('Configure MERCADO_PAGO_ACCESS_TOKEN_TEST no servidor.');
  const response = await fetch('https://api.mercadopago.com' + path, {
    ...init, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Mercado Pago não confirmou a solicitação (' + response.status + '). Confira as credenciais de teste.');
  return await response.json();
}
async function seller() {
  const account = await mp('/users/me');
  if (!Array.isArray(account.tags) || !account.tags.includes('test_user') || account.site_id !== 'MLB') {
    throw new Error('Use as credenciais da conta vendedora de teste do Brasil. Cobranças reais estão bloqueadas.');
  }
  return account;
}
function checkoutUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' || !['www.mercadopago.com.br', 'www.mercadopago.com'].includes(url.hostname)) throw new Error('Endereço de pagamento inválido.');
  return url.href;
}
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  try {
    if (req.method === 'GET') {
      await seller();
      return json({ ready: true, mode: 'test', live_payments: false });
    }
    if (req.method !== 'POST') return json({ error: 'Método inválido.' }, 405);
    const authorization = req.headers.get('authorization') || '';
    if (!/^Bearer .+/.test(authorization)) return json({ error: 'Entre na conta da empresa para testar o pagamento.' }, 401);
    const auth = await fetch(base + '/auth/v1/user', { headers: { apikey: admin, Authorization: authorization }, signal: AbortSignal.timeout(15000) });
    if (!auth.ok) return json({ error: 'Sua sessão expirou. Entre novamente.' }, 401);
    const user = await auth.json();
    if (!user.id || user.is_anonymous) return json({ error: 'Entre na conta da empresa.' }, 401);
    const body = await req.json();
    const account = await seller();
    if (body.action === 'status') {
      if (!/^[0-9a-f-]{36}$/.test(String(body.orderId))) return json({ error: 'Pedido inválido.' }, 400);
      const rows = await db('em_payment_test_orders?id=eq.' + body.orderId + '&user_id=eq.' + user.id + '&select=*');
      const order = rows[0];
      if (!order) return json({ error: 'Pedido não encontrado.' }, 404);
      const payments = await mp('/v1/payments/search?external_reference=' + encodeURIComponent(order.id) + '&sort=date_created&criteria=desc&limit=20');
      const payment = (payments.results || []).find((p: any) => p.external_reference === order.id && String(p.collector_id) === String(account.id) && p.live_mode === false && p.currency_id === 'BRL' && Math.round(Number(p.transaction_amount) * 100) === 990 && p.status === 'approved');
      if (payment) {
        await db('em_payment_test_orders?id=eq.' + order.id + '&user_id=eq.' + user.id, { method: 'PATCH', body: JSON.stringify({ status: 'approved_test', payment_id: String(payment.id), updated_at: new Date().toISOString() }) });
        return json({ mode: 'test', status: 'approved_test', message: 'Pagamento de teste aprovado. Nenhum serviço real foi ativado.' });
      }
      return json({ mode: 'test', status: 'pending', message: 'Pagamento de teste ainda não aprovado.' });
    }
    const service = catalog[body.servico as keyof typeof catalog];
    if (!service || !/^[0-9a-f-]{36}$/.test(String(body.vagaId))) return json({ error: 'Escolha uma vaga real e um serviço válido. A prévia demonstrativa não recebe pagamentos.' }, 400);
    const jobs = await db('vagas?id=eq.' + body.vagaId + '&user_id=eq.' + user.id + '&select=id,empresa_id,cargo,status');
    const job = jobs[0];
    if (!job || !job.empresa_id) return json({ error: 'Vaga não encontrada na sua conta.' }, 404);
    if (!['aprovada', 'ativa'].includes(job.status)) return json({ error: 'Selecione uma vaga ativa para testar.' }, 400);
    const companies = await db('empresas?id=eq.' + job.empresa_id + '&user_id=eq.' + user.id + '&select=id,plano,plano_id');
    const company = companies[0];
    if (!company) return json({ error: 'Empresa não encontrada na sua conta.' }, 403);
    if (!['basico', 'gratis', 'gratuito', 'free', ''].includes(String(company.plano_id || company.plano || '').toLowerCase())) return json({ error: 'Estes serviços avulsos são do plano grátis.' }, 400);
    // No browser-provided price, duration, seller, or arbitrary callback URLs.
    const id = crypto.randomUUID();
    const pending = await db('em_payment_test_orders?user_id=eq.' + user.id + '&created_at=gte.' + encodeURIComponent(new Date(Date.now() - 60000).toISOString()) + '&select=id');
    if (pending.length >= 3) return json({ error: 'Aguarde um minuto antes de iniciar outro teste.' }, 429);
    await db('em_payment_test_orders', { method: 'POST', body: JSON.stringify({ id, user_id: user.id, empresa_id: company.id, vaga_id: job.id, service: body.servico, days: service.days, amount_cents: 990, seller_id: String(account.id) }) });
    const preference = await mp('/checkout/preferences', { method: 'POST', body: JSON.stringify({
      items: [{ id: body.servico, title: '[TESTE] MaisEmpregos — ' + service.title, description: service.days + ' dias por vaga — teste sem ativação real', quantity: 1, unit_price: 9.90, currency_id: 'BRL' }],
      external_reference: id,
      metadata: { mode: 'test', order_id: id, vaga_id: job.id, service: body.servico },
      expires: true, expiration_date_to: new Date(Date.now() + 3600000).toISOString(),
    }) });
    const url = checkoutUrl(preference.init_point);
    await db('em_payment_test_orders?id=eq.' + id, { method: 'PATCH', body: JSON.stringify({ preference_id: preference.id, checkout_url: url, updated_at: new Date().toISOString() }) });
    return json({ mode: 'test', orderId: id, checkoutUrl: url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Pagamento indisponível.' }, 400);
  }
});
