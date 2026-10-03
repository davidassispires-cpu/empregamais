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
 let t=token();if(t)return t;
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
export async function saveJob(company,data,id=""){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const u=await getCurrentUser();if(!u?.id)throw new Error("Usuário não autenticado.");
 const payload={user_id:u.id,empresa_id:company.id,empresa:company.nome||company.razao_social||"",empresa_cnpj:String(company.cnpj||"").replace(/\D/g,""),cargo:data.cargo,area:data.area||null,contrato:data.contrato||null,modalidade:data.modalidade||null,cep:data.cep||null,estado:data.estado||null,cidade:data.cidade||null,data_encerramento:data.data_encerramento||null,escolaridade:data.escolaridade||null,experiencia:data.experiencia||null,jornada:data.jornada||null,pcd:data.pcd||null,salario:data.salario||null,salario_combinar:!!data.salario_combinar,descricao:data.descricao,requisitos:data.requisitos||null,beneficios:data.beneficios||null,confidencial:!!data.confidencial,destaque:!!data.destaque,urgente:!!data.urgente,candidatura_tipo:data.candidatura_tipo||"portal",candidatura_email:data.candidatura_email||null,candidatura_whatsapp:data.candidatura_whatsapp||null,candidatura_link:data.candidatura_link||null,status:"pendente"};
 const path=id?"/rest/v1/vagas?id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id):"/rest/v1/vagas";
 const method=id?"PATCH":"POST";if(id)payload.editado_em=new Date().toISOString();
 const rows=await json(path,{method,headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(payload)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("O Supabase não confirmou o salvamento da vaga.");
 return rows[0];
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
