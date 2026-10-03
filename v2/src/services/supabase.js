const URL="https://mkezlcewyengejdmtppl.supabase.co";
const KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
const TOKEN_KEY="empregaMaisSupabaseAccessToken";
const REFRESH_KEY="empregaMaisSupabaseRefreshToken";
const LOGOUT_KEY="empregaMaisLogoutBloqueio";

function token(){return sessionStorage.getItem(TOKEN_KEY)||localStorage.getItem(TOKEN_KEY)||""}
function refreshToken(){return sessionStorage.getItem(REFRESH_KEY)||localStorage.getItem(REFRESH_KEY)||""}
function clearSession(){for(const k of [TOKEN_KEY,REFRESH_KEY]){sessionStorage.removeItem(k);localStorage.removeItem(k)}}
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
 if(localStorage.getItem(LOGOUT_KEY)==="1"||sessionStorage.getItem(LOGOUT_KEY)==="1"){clearSession();return ""}
 let t=token();if(t){try{await json("/auth/v1/user",{headers:headers(t)});return t}catch{sessionStorage.removeItem(TOKEN_KEY);localStorage.removeItem(TOKEN_KEY)}}
 const rt=refreshToken();if(!rt){clearSession();return ""}
 try{const a=await json("/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:headers(""),body:JSON.stringify({refresh_token:rt})});saveSession(a);return a.access_token||""}
 catch{clearSession();return ""}
}
export async function getCurrentUser(){
 const t=await ensureSession();if(!t)return null;
 try{return await json("/auth/v1/user",{headers:headers(t)})}catch{clearSession();return null}
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
export const COMPANY_PLANS={basico:{nome:"Grátis",dias:30,vagas:3,destaques:0,urgentes:0,confidenciais:0},mensal:{nome:"Mensal",dias:30,vagas:6,destaques:1,urgentes:1,confidenciais:0},trimestral:{nome:"Trimestral",dias:90,vagas:12,destaques:3,urgentes:3,confidenciais:2},semestral:{nome:"Semestral",dias:180,vagas:25,destaques:5,urgentes:5,confidenciais:4},anual:{nome:"Anual",dias:365,vagas:60,destaques:10,urgentes:10,confidenciais:8}};
function closingDate(days=30){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
export function planUsage(company,jobs){
 const p=COMPANY_PLANS[company?.plano_id||company?.plano]||COMPANY_PLANS.basico,now=new Date(),explicitEnd=company?.plano_valido_ate||company?.assinatura_fim||"",explicitStart=company?.plano_inicio||company?.plano_liberado_em||company?.assinatura_inicio||"";
 let start,end;
 if(explicitStart){start=new Date(explicitStart);end=explicitEnd?new Date(explicitEnd):new Date(start.getTime()+p.dias*86400000)}
 else if(explicitEnd){end=new Date(explicitEnd);start=new Date(end.getTime()-p.dias*86400000)}
 else if((company?.plano_id||company?.plano||"basico")==="basico"){const created=company?.criado_em?new Date(company.criado_em):now,elapsed=Math.max(0,now-created),cycle=Math.floor(elapsed/(p.dias*86400000));start=new Date(created.getTime()+cycle*p.dias*86400000);end=new Date(start.getTime()+p.dias*86400000)}
 else {start=company?.criado_em?new Date(company.criado_em):now;end=new Date(start.getTime()+p.dias*86400000)}
 const expired=now>end;
 const used=(jobs||[]).filter(v=>v.status!=="excluida"&&new Date(v.criado_em||0)>=start&&new Date(v.criado_em||0)<=end);
 return {plano:p,inicio:start,fim:end,expirado:expired,vagas:used.length,destaques:used.filter(v=>v.destaque||v.destaque_solicitado).length,urgentes:used.filter(v=>v.urgente||v.urgencia_solicitada).length,confidenciais:used.filter(v=>v.confidencial).length};
}
export async function saveJob(company,data,id=""){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const u=await getCurrentUser();if(!u?.id)throw new Error("Usuário não autenticado.");
 const jobs=await getCompanyJobs(company),old=id?jobs.find(v=>String(v.id)===String(id)):null,usage=planUsage(company,jobs),p=usage.plano,free=p.nome==="Grátis";
 if(usage.expirado&&p.nome!=="Grátis")throw new Error("A vigência do plano "+p.nome+" terminou. Renove o plano para publicar ou editar vagas.");
 if(!id&&usage.vagas>=p.vagas)throw new Error("Limite de publicações atingido para o plano "+p.nome+".");
 if(id&&old?.status==="excluida")throw new Error("Uma vaga excluída não pode ser editada.");
 if(!free&&data.destaque&&!(old?.destaque)&&usage.destaques>=p.destaques)throw new Error("Seu plano não possui Destaque disponível neste período.");
 if(!free&&data.urgente&&!(old?.urgente)&&usage.urgentes>=p.urgentes)throw new Error("Seu plano não possui Urgência disponível neste período.");
 if(data.confidencial&&!(old?.confidencial)&&usage.confidenciais>=p.confidenciais)throw new Error("Seu plano não possui vaga Confidencial disponível neste período.");
 const destaqueSolicitado=free&&!!data.destaque&&!(old?.destaque||old?.destaque_solicitado),urgenciaSolicitada=free&&!!data.urgente&&!(old?.urgente||old?.urgencia_solicitada);
 const payload={user_id:u.id,empresa_id:company.id,empresa:company.nome||company.razao_social||"",empresa_cnpj:String(company.cnpj||"").replace(/\D/g,""),cargo:data.cargo,area:data.area||null,contrato:data.contrato||null,modalidade:data.modalidade||null,cep:data.cep||null,estado:data.estado||null,cidade:data.cidade||null,data_encerramento:data.data_encerramento||closingDate(30),escolaridade:data.escolaridade||null,experiencia:data.experiencia||null,jornada:data.jornada||null,pcd:data.pcd||null,senior50:!!data.senior50,salario:data.salario||null,salario_max:data.salario_max||null,salario_combinar:!!data.salario_combinar,descricao:data.descricao,requisitos:data.requisitos||null,beneficios:data.beneficios||null,confidencial:!!data.confidencial,destaque:destaqueSolicitado?false:!!data.destaque,urgente:urgenciaSolicitada?false:!!data.urgente,destaque_solicitado:!!(old?.destaque_solicitado||destaqueSolicitado),urgencia_solicitada:!!(old?.urgencia_solicitada||urgenciaSolicitada),candidatura_tipo:data.candidatura_tipo||"portal",candidatura_email:data.candidatura_email||null,candidatura_whatsapp:data.candidatura_whatsapp||null,candidatura_link:data.candidatura_link||null,status:old?.status==="aprovada"?"pendente":(old?.status||"pendente")};
 if(id){payload.editado_em=new Date().toISOString();payload.edicoes_apos_aprovacao=old?.status==="aprovada"?Number(old.edicoes_apos_aprovacao||0)+1:Number(old?.edicoes_apos_aprovacao||0);payload.motivo_reprovacao=null}
 const path=id?"/rest/v1/vagas?id=eq."+encodeURIComponent(id)+"&empresa_id=eq."+encodeURIComponent(company.id):"/rest/v1/vagas",method=id?"PATCH":"POST";
 const rows=await json(path,{method,headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(payload)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("O Supabase não confirmou o salvamento da vaga.");return rows[0];
}

export async function getApplications(company){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const rows=await json("/rest/v1/candidaturas?select=*&empresa_user_id=eq."+encodeURIComponent(company.user_id)+"&order=criado_em.desc",{headers:headers(t)});
 return Array.isArray(rows)?rows:[];
}
export async function updateApplication(id,status,extra={}){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 const now=new Date().toISOString(),current=await json("/rest/v1/candidaturas?select=*&id=eq."+encodeURIComponent(id)+"&limit=1",{headers:headers(t)}),old=Array.isArray(current)?current[0]:null;
 if(!old)throw new Error("Candidatura não encontrada.");
 const history=Array.isArray(old.historico)?old.historico.slice():[];if(status&&status!==old.status)history.push({status,data:now});
 const body={status:status||old.status,atualizado_em:now,historico:history};
 if("entrevista" in extra)body.entrevista=extra.entrevista||null;
 if(status==="Contratado")body.contratado_em=old.contratado_em||now;else if(status&&old.status==="Contratado")body.contratado_em=null;
 const rows=await json("/rest/v1/candidaturas?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível atualizar a candidatura.");return rows[0];
}

export async function updateCompany(company,data){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id)throw new Error("Empresa não encontrada.");
 const allowed=["nome","nome_fantasia","razao_social","email_corporativo","email_candidaturas","telefone","responsavel","funcao_responsavel","cep","logradouro","bairro","numero","complemento","cidade","uf","sobre","site","setor","funcionarios","logo_url","capa_url"];
 const body={};for(const k of allowed)if(k in data)body[k]=data[k]||null;
 const rows=await json("/rest/v1/empresas?id=eq."+encodeURIComponent(company.id),{method:"PATCH",headers:{...headers(t),Prefer:"return=representation"},body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível salvar os dados da empresa.");
 return rows[0];
}

function digits(v){return String(v||"").replace(/\D/g,"")}
function authEmail(cnpj){return digits(cnpj)+"@auth.empregamais.com.br"}
export async function loginCompany(cnpj,password){
 localStorage.removeItem(LOGOUT_KEY);sessionStorage.removeItem(LOGOUT_KEY);
 const n=digits(cnpj);if(n.length!==14)throw new Error("Informe um CNPJ válido.");if(!password)throw new Error("Informe sua senha.");
 let email=authEmail(n);
 try{const r=await fetch(URL+"/functions/v1/auth-empresa-cnpj",{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY},body:JSON.stringify({cnpj:n})});if(r.ok){const d=await r.json();if(d?.email)email=d.email}}catch{}
 let a;try{a=await json("/auth/v1/token?grant_type=password",{method:"POST",headers:headers(""),body:JSON.stringify({email,password})})}catch(e){if(email!==authEmail(n))a=await json("/auth/v1/token?grant_type=password",{method:"POST",headers:headers(""),body:JSON.stringify({email:authEmail(n),password})});else throw e}
 if(!a?.access_token||!a?.user?.id)throw new Error("Não foi possível iniciar a sessão.");saveSession(a);
 const company=await getCompany();if(!company||digits(company.cnpj)!==n){await logoutCompany();throw new Error("O cadastro autenticado não corresponde ao CNPJ informado.");}
 localStorage.removeItem(LOGOUT_KEY);sessionStorage.removeItem(LOGOUT_KEY);return company;
}
export async function logoutCompany(){
 const t=token();localStorage.setItem(LOGOUT_KEY,"1");sessionStorage.setItem(LOGOUT_KEY,"1");clearSession();try{if(t)await fetch(URL+"/auth/v1/logout",{method:"POST",headers:headers(t)})}catch{}
 clearSession()
 sessionStorage.removeItem("empresaSupabaseUserId");sessionStorage.removeItem("empresaSupabaseEmpresaId");
}
export async function hasCompanySession(){return !!(await getCompany())}

export async function updateJobStatus(company,id,status){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id||!id)throw new Error("Vaga inválida.");
 const current=await getJob(id,company);if(!current||current.status==="excluida")throw new Error("Vaga não encontrada.");
 if(status==="pendente"&&current.status!=="encerrada")throw new Error("Somente vagas encerradas podem ser reabertas.");
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

export async function uploadCompanyImage(company,file,type="logo"){
 const t=await ensureSession();if(!t)throw new Error("Sua sessão expirou. Entre novamente.");
 if(!company?.id||!file)throw new Error("Arquivo inválido.");if(file.size>3*1024*1024)throw new Error("A imagem deve ter no máximo 3 MB.");
 if(!/^image\/(png|jpeg|webp)$/i.test(file.type))throw new Error("Envie uma imagem PNG, JPG ou WEBP.");
 const u=await getCurrentUser(),ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg",path=u.id+"/"+type+"-"+Date.now()+"."+ext;
 const r=await fetch(URL+"/storage/v1/object/logos-empresas/"+encodeURI(path),{method:"POST",headers:{apikey:KEY,Authorization:"Bearer "+t,"Content-Type":file.type,"x-upsert":"true"},body:file});
 if(!r.ok){let m="";try{m=(await r.json()).message||""}catch{}throw new Error(m||"Não foi possível enviar a imagem.");}
 return URL+"/storage/v1/object/public/logos-empresas/"+path;
}
export async function registerCompany(data){
 localStorage.removeItem(LOGOUT_KEY);sessionStorage.removeItem(LOGOUT_KEY);
 const cnpj=digits(data.cnpj),email=String(data.email||"").trim().toLowerCase(),emailApps=String(data.email_candidaturas||email).trim().toLowerCase(),phone=digits(data.telefone);
 if(String(data.nome||"").trim().length<2)throw new Error("Informe o nome da empresa.");
 if(cnpj.length!==14)throw new Error("Informe um CNPJ com 14 números.");
 if(!email.includes("@"))throw new Error("Informe um e-mail corporativo válido.");
 if(!emailApps.includes("@"))throw new Error("Informe um e-mail válido para candidaturas.");
 if(phone.length<10)throw new Error("Informe um telefone válido.");
 if(String(data.password||"").length<6)throw new Error("A senha deve ter pelo menos 6 caracteres.");
 if(data.password!==data.password2)throw new Error("As senhas não conferem.");
 const existing=await json("/rest/v1/empresas?select=id&cnpj=eq."+encodeURIComponent(cnpj)+"&limit=1",{headers:headers("")});if(Array.isArray(existing)&&existing.length)throw new Error("Já existe uma empresa cadastrada com este CNPJ.");
 const a=await json("/auth/v1/signup",{method:"POST",headers:headers(""),body:JSON.stringify({email,password:data.password})});
 if(!a?.access_token||!a?.user?.id)throw new Error("O cadastro foi criado, mas a sessão automática não foi liberada. Entre pela tela de login.");
 saveSession(a);
 try{
  const rows=await json("/rest/v1/empresas",{method:"POST",headers:{...headers(a.access_token),Prefer:"return=representation"},body:JSON.stringify({user_id:a.user.id,nome:String(data.nome).trim(),cnpj,email,email_corporativo:email,email_candidaturas:emailApps,telefone:String(data.telefone||"").trim(),plano:"basico",plano_id:"basico",verificacao_status:"nao_verificada",verificada:false,plano_liberado_admin:false,plano_sem_cobranca:false,aprovacao_automatica_suspensa:false})});
  if(!Array.isArray(rows)||!rows[0])throw new Error("O Supabase não confirmou o cadastro da empresa.");return rows[0];
 }catch(e){await logoutCompany();throw e}
}
export async function requestCompanyPasswordReset(cnpj){
 const n=digits(cnpj);if(n.length!==14)throw new Error("Informe um CNPJ válido.");
 const r=await fetch(URL+"/functions/v1/recuperar-senha-empresa",{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY},body:JSON.stringify({cnpj:n,redirectTo:location.origin+location.pathname+"?pagina=redefinir-senha"})});
 if(!r.ok)throw new Error("Não foi possível solicitar a recuperação agora.");
 return true;
}
export async function updateCompanyPassword(password){
 if(String(password||"").length<6)throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
 const t=await ensureSession();if(!t)throw new Error("O link de recuperação expirou ou não é válido.");
 await json("/auth/v1/user",{method:"PUT",headers:headers(t),body:JSON.stringify({password})});return true;
}
export function captureRecoverySession(){
 const raw=(location.hash||"").replace(/^#/,""),p=new URLSearchParams(raw),a=p.get("access_token"),r=p.get("refresh_token"),type=p.get("type");
 if(a&&r&&(type==="recovery"||p.get("expires_in"))){localStorage.removeItem(LOGOUT_KEY);sessionStorage.removeItem(LOGOUT_KEY);saveSession({access_token:a,refresh_token:r});history.replaceState({},document.title,location.pathname+"?pagina=redefinir-senha");return true}return false;
}