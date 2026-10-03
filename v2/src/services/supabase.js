const URL="https://mkezlcewyengejdmtppl.supabase.co";
const KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
const TOKEN_KEY="empregaMaisSupabaseAccessToken";
const REFRESH_KEY="empregaMaisSupabaseRefreshToken";

function token(){return sessionStorage.getItem(TOKEN_KEY)||localStorage.getItem(TOKEN_KEY)||""}
function refreshToken(){return sessionStorage.getItem(REFRESH_KEY)||localStorage.getItem(REFRESH_KEY)||""}
function saveSession(a){
 if(a?.access_token){sessionStorage.setItem(TOKEN_KEY,a.access_token);localStorage.setItem(TOKEN_KEY,a.access_token)}
 if(a?.refresh_token){sessionStorage.setItem(REFRESH_KEY,a.refresh_token);localStorage.setItem(REFRESH_KEY,a.refresh_token)}
}
function headers(t=token()){const h={apikey:KEY,"Content-Type":"application/json"};if(t)h.Authorization="Bearer "+t;return h}
async function json(path,opt={}){
 const r=await fetch(URL+path,opt),txt=await r.text();let data={};
 try{data=txt?JSON.parse(txt):{}}catch{}
 if(!r.ok)throw new Error(data.message||data.msg||data.error_description||data.error||("Erro "+r.status));
 return data;
}
async function ensureSession(){
 let t=token();if(t){try{await json("/auth/v1/user",{headers:headers(t)});return t}catch{for(const k of [TOKEN_KEY]){sessionStorage.removeItem(k);localStorage.removeItem(k)}}}
 const rt=refreshToken();if(!rt)return "";
 const a=await json("/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:headers(""),body:JSON.stringify({refresh_token:rt})});
 saveSession(a);return a.access_token||"";
}
export async function getCurrentUser(){
 const t=await ensureSession();if(!t)return null;
 try{return await json("/auth/v1/user",{headers:headers(t)})}catch{return null}
}
export async function getCompany(){
 const u=await getCurrentUser();if(!u?.id)return null;
 const rows=await json("/rest/v1/empresas?select=*&user_id=eq."+encodeURIComponent(u.id)+"&limit=1",{headers:headers()});
 return Array.isArray(rows)?rows[0]||null:null;
}
export async function getCompanyJobs(company){
 if(!company?.id)return [];
 const rows=await json("/rest/v1/vagas?select=*&empresa_id=eq."+encodeURIComponent(company.id)+"&order=criado_em.desc",{headers:headers()});
 return Array.isArray(rows)?rows:[];
}
export function jobStatus(v){
 if(v.status==="aprovada"&&(!v.data_encerramento||new Date(v.data_encerramento+"T23:59:59")>=new Date()))return "Ativa";
 if(["pendente","em_analise","analise"].includes(v.status))return "Em análise";
 return "Encerrada";
}

export async function getJob(id,company){
 if(!id||!company?.id)return null;
 const rows=await json("/rest/v1/vagas?select=*&id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id)+"&limit=1",{headers:headers()});
 return Array.isArray(rows)?rows[0]||null:null;
}
export const COMPANY_PLANS={basico:{nome:"Grátis",dias:30,vagas:3,destaques:0,urgentes:0,confidenciais:0},mensal:{nome:"Mensal",dias:30,vagas:6,destaques:1,urgentes:1,confidenciais:0},trimestral:{nome:"Trimestral",dias:90,vagas:12,destaques:3,urgentes:3,confidenciais:2},semestral:{nome:"Semestral",dias:180,vagas:25,destaques:5,urgentes:5,confidenciais:4}};
function closingDate(days=30){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
export function planUsage(company,jobs){
 const p=COMPANY_PLANS[company?.plano_id||company?.plano]||COMPANY_PLANS.basico,endRaw=company?.plano_valido_ate||company?.assinatura_fim||"",startRaw=company?.plano_ativado_em||company?.assinatura_inicio||company?.criado_em||"";
 let start=startRaw?new Date(startRaw):new Date(),end=endRaw?new Date(endRaw):new Date(start.getTime()+p.dias*86400000);if(!startRaw)start=new Date(end.getTime()-p.dias*86400000);
 const used=(jobs||[]).filter(v=>v.status!=="excluida"&&new Date(v.criado_em||0)>=start&&new Date(v.criado_em||0)<=end);
 return {plano:p,vagas:used.length,destaques:used.filter(v=>v.destaque).length,urgentes:used.filter(v=>v.urgente).length,confidenciais:used.filter(v=>v.confidencial).length};
}
export async function saveJob(company,data,id=""){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const u=await getCurrentUser();if(!u?.id)throw new Error("Usuário não autenticado.");
 const jobs=await getCompanyJobs(company),old=id?jobs.find(v=>String(v.id)===String(id)):null,usage=planUsage(company,jobs),p=usage.plano,free=p.nome==="Grátis";
 if(!id&&usage.vagas>=p.vagas)throw new Error("Limite de publicações atingido para o plano "+p.nome+".");
 if(!free&&data.destaque&&!(old?.destaque)&&usage.destaques>=p.destaques)throw new Error("Seu plano não possui Destaque disponível neste período.");
 if(!free&&data.urgente&&!(old?.urgente)&&usage.urgentes>=p.urgentes)throw new Error("Seu plano não possui Urgência disponível neste período.");
 if(data.confidencial&&!(old?.confidencial)&&usage.confidenciais>=p.confidenciais)throw new Error("Seu plano não possui vaga Confidencial disponível neste período.");
 const destaqueSolicitado=free&&!!data.destaque&&!id,urgenciaSolicitada=free&&!!data.urgente&&!id;
 const payload={user_id:u.id,empresa_id:company.id,empresa:company.nome||company.razao_social||"",empresa_cnpj:String(company.cnpj||"").replace(/\D/g,""),cargo:data.cargo,area:data.area||null,contrato:data.contrato||null,modalidade:data.modalidade||null,cep:data.cep||null,estado:data.estado||null,cidade:data.cidade||null,data_encerramento:data.data_encerramento||closingDate(30),escolaridade:data.escolaridade||null,experiencia:data.experiencia||null,jornada:data.jornada||null,pcd:data.pcd||null,salario:data.salario||null,salario_combinar:!!data.salario_combinar,descricao:data.descricao,requisitos:data.requisitos||null,beneficios:data.beneficios||null,confidencial:!!data.confidencial,destaque:destaqueSolicitado?false:!!data.destaque,urgente:urgenciaSolicitada?false:!!data.urgente,destaque_solicitado:destaqueSolicitado,urgencia_solicitada:urgenciaSolicitada,candidatura_tipo:data.candidatura_tipo||"portal",candidatura_email:data.candidatura_email||null,candidatura_whatsapp:data.candidatura_whatsapp||null,candidatura_link:data.candidatura_link||null,status:old?.status==="aprovada"?"pendente":(old?.status||"pendente")};
 if(id){payload.editado_em=new Date().toISOString();payload.edicoes_apos_aprovacao=old?.status==="aprovada"?Number(old.edicoes_apos_aprovacao||0)+1:Number(old?.edicoes_apos_aprovacao||0);payload.motivo_reprovacao=null}
 const path=id?"/rest/v1/vagas?id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id):"/rest/v1/vagas",method=id?"PATCH":"POST";
 const rows=await json(path,{method,headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(payload)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("O Supabase não confirmou o salvamento da vaga.");return rows[0];
}

export async function getApplications(){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 const rows=await json("/rest/v1/candidaturas?select=*&order=criado_em.desc",{headers:headers(t)});
 return Array.isArray(rows)?rows:[];
}
export async function updateApplication(id,status){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 const now=new Date().toISOString();
 const rows=await json("/rest/v1/candidaturas?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify({status,atualizado_em:now})});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível atualizar a candidatura.");
 return rows[0];
}

export async function updateCompany(company,data){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const allowed=["nome","nome_fantasia","razao_social","email_corporativo","email_candidaturas","telefone","responsavel","funcao_responsavel","cep","logradouro","bairro","numero","complemento","cidade","uf","sobre","site","setor","funcionarios"];
 const body={};for(const k of allowed)if(k in data)body[k]=data[k]||null;
 const rows=await json("/rest/v1/empresas?id=eq."+encodeURIComponent(company.id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível salvar os dados da empresa.");
 return rows[0];
}

function digits(v){return String(v||"").replace(/\D/g,"")}
function authEmail(cnpj){return digits(cnpj)+"@auth.empregamais.com.br"}
export async function loginCompany(cnpj,password){
 if(digits(cnpj).length!==14)throw new Error("Informe um CNPJ válido.");
 if(!password)throw new Error("Informe sua senha.");
 const a=await json("/auth/v1/token?grant_type=password",{method:"POST",headers:headers(""),body:JSON.stringify({email:authEmail(cnpj),password})});
 if(!a?.access_token||!a?.user?.id)throw new Error("Não foi possível iniciar a sessão.");
 saveSession(a);
 const c=await getCompany();
 if(!c||digits(c.cnpj)!==digits(cnpj)){await logoutCompany();throw new Error("O cadastro autenticado não corresponde ao CNPJ informado.");}
 localStorage.removeItem("empregaMaisLogoutBloqueio");sessionStorage.removeItem("empregaMaisLogoutBloqueio");
 return c;
}
export async function logoutCompany(){
 const t=token();try{if(t)await fetch(URL+"/auth/v1/logout",{method:"POST",headers:headers(t)})}catch{}
 for(const k of [TOKEN_KEY,REFRESH_KEY]){sessionStorage.removeItem(k);localStorage.removeItem(k)}
 sessionStorage.removeItem("empresaSupabaseUserId");sessionStorage.removeItem("empresaSupabaseEmpresaId");
}
export async function hasCompanySession(){return !!(await getCompany())}

export async function updateJobStatus(company,id,status){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id||!id)throw new Error("Vaga inválida.");
 const body={status,editado_em:new Date().toISOString()};
 if(status==="encerrada")body.data_encerramento=new Date().toISOString().slice(0,10);
 if(status==="pendente")body.data_encerramento=closingDate(30);
 const rows=await json("/rest/v1/vagas?id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível atualizar a vaga.");return rows[0];
}
export async function deleteJob(company,id){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id||!id)throw new Error("Vaga inválida.");
 const rows=await json("/rest/v1/vagas?id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify({status:"excluida",editado_em:new Date().toISOString()})});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível excluir a vaga.");return rows[0];
}
