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
