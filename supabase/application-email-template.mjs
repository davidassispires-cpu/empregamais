// Server-only renderer. Does not send mail or expose the resume.
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const line = value => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
export function applicationEmail({candidateName, jobTitle, jobId, createdAt, portalUrl}) {
 const base = new URL(portalUrl);
 if(base.protocol !== 'https:' || base.username || base.password) throw new Error('Portal HTTPS obrigatório.');
 base.search = ''; base.hash = '';
 base.searchParams.set('pagina','painel-empresa');
 base.searchParams.set('abaPainel','candidates');
 // The panel authenticates company access; this URL grants no access itself.
 const url = base.href;
 const subject = 'Nova candidatura — '+line(jobTitle)+' | '+line(jobId);
 const date = new Date(createdAt);
 if(!Number.isFinite(date.getTime())) throw new Error('Data inválida.');
 const when = date.toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'});
 const text = 'Nova candidatura recebida\n\n'+line(candidateName)+' se candidatou à vaga '+line(jobTitle)+'.\nID da vaga: '+line(jobId)+'\nRecebida em: '+when+'\n\nVer currículo e candidatura: '+url+'\nEntre na conta da empresa para acessar o currículo.';
 const html = '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body style="margin:0;background:#f4f7fb;font-family:Poppins,sans-serif;color:#163252"><table role="presentation" style="max-width:600px;width:100%;margin:24px auto;background:white;border:1px solid #dce6f3;border-radius:12px"><tr><td style="padding:24px;border-bottom:3px solid #f58a20"><strong style="color:#0969d6">EmpregaMais</strong><h1 style="font-size:23px">Nova candidatura recebida</h1><p>'+escapeHtml(candidateName)+' se candidatou à vaga <strong>'+escapeHtml(jobTitle)+'</strong>.</p><p style="font-size:13px">ID da vaga: '+escapeHtml(jobId)+'<br>Recebida em: '+escapeHtml(when)+'</p><p style="margin:28px 0"><a href="'+escapeHtml(url)+'" style="background:#0969d6;color:white;text-decoration:none;padding:13px 18px;border-radius:7px">Ver currículo e candidatura</a></p><p style="font-size:12px;color:#61728a">Entre na conta da empresa para acessar o currículo e acompanhar o processo seletivo.</p></td></tr></table></body></html>';
 return {subject,text,html};
}
