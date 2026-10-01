import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const dbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: "Bearer " + SERVICE_KEY,
  "Content-Type": "application/json",
};

function stripTags(s = "") {
  return String(s)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

function unsafeHost(host: string) {
  const h = host.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local")) return true;
  if (/^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) return true;
  const m = h.match(/^172\.(\d{1,3})\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  return false;
}

function providerFromHost(host: string) {
  const h = host.toLowerCase();
  if (h === "ats.abler.com.br" || h.endsWith(".abler.com.br")) return "abler";
  if (h.includes("gupy.io") || h.includes("gupy.com.br")) return "gupy";
  if (h.includes("solides.com.br")) return "solides";
  if (h.includes("pandape.com") || h.includes("pandape.info")) return "pandape";
  if (h.includes("myworkdayjobs.com") || h.includes("workday.com")) return "workday";
  if (h.includes("greenhouse.io")) return "greenhouse";
  if (h.includes("lever.co")) return "lever";
  if (h === "ai.yapp.rec.br" || h.endsWith(".yapp.rec.br")) return "yapp";
  if (h === "randstad.com.br" || h.endsWith(".randstad.com.br")) return "randstad";
  return "generic";
}

function likelyJob(url: string, title: string, provider: string, sourceHost: string) {
  const u = url.toLowerCase();
  const t = title.toLowerCase();
  if (provider === "abler") return /ats\.abler\.com\.br\/jobs\//i.test(url) && /[?&]slug=/i.test(url);
  if (provider === "yapp") {
    try {
      const x = new URL(url);
      if (x.hostname !== sourceHost) return false;
    } catch { return false; }
    return /\/(vaga|vagas|job|jobs|oportunidade|oportunidades)\b/i.test(u) ||
      (/carreiras\//i.test(u) && !/\/carreiras\/?[0-9a-f-]{20,}\/?$/i.test(u));
  }
  return /\/(vaga|vagas|job|jobs|position|positions|opening|openings|opportunity|oportunidade|oportunidades)\b/i.test(u) ||
    /\b(vaga|job|position|oportunidade)\b/i.test(t);
}

function solidesPageUrl(source:URL,page:number){const u=new URL(source.toString());if(page<=1){u.searchParams.delete("page");return u.toString()}u.searchParams.set("page",String(page));return u.toString()}
function collectSolidesJobUrls(html:string,source:URL){
 const map=new Map<string,{url:string,title:string}>();
 const decoded=String(html).replace(/\\\\\\//g,"/").replace(/&amp;/g,"&");
 const re=/\\/vaga\\/\\d+(?:\\/[^"'<\\s?#]*)?(?:\\?[^"'<\\s]*)?/gi;
 let m:RegExpExecArray|null;
 while((m=re.exec(decoded))){try{const u=new URL(m[0],source);u.hash="";map.set(u.toString(),{url:u.toString(),title:""});}catch{}}
 for(const x of collectAnchors(html,source,"solides")){try{const u=new URL(x.url);if(/\\/vaga\\/\\d+/i.test(u.pathname))map.set(u.toString(),x)}catch{}}
 return [...map.values()];
}
async function extractSolidesJobs(source:URL){
 const map=new Map<string,{url:string,title:string}>();let empty=0;
 for(let p=1;p<=60;p++){try{const r=await fetchText(solidesPageUrl(source,p),18000);const found=collectSolidesJobUrls(r.text,source);const before=map.size;for(const x of found)map.set(x.url,x);if(!found.length||map.size===before)empty++;else empty=0;if(empty>=2&&p>=3)break}catch{break}}
 const base=[...map.values()].slice(0,600),jobs:any[]=[];
 for(let i=0;i<base.length;i+=8)jobs.push(...await Promise.all(base.slice(i,i+8).map(x=>enrichJob(x,"solides"))));
 return {jobs,total:jobs.length};
}

function randstadPageUrl(source:URL,page:number){const u=new URL(source.toString());if(page<=1){u.searchParams.delete("page");return u.toString()}u.searchParams.set("page",String(page));return u.toString()}
function parseRandstadTotal(html:string){const text=stripTags(html);const m=text.match(/([\d.]+)\s+vagas?\s+encontradas?/i)||text.match(/pesquisar\s+([\d.]+)\s+vagas?/i);return m?Number(String(m[1]).replace(/\./g,""))||0:0}
async function extractRandstadJobs(source:URL){
 const first=await fetchText(randstadPageUrl(source,1),18000),total=parseRandstadTotal(first.text),map=new Map<string,{url:string,title:string}>();
 const add=(html:string)=>{for(const a of collectAnchors(html,source,"randstad")){try{const u=new URL(a.url);if(u.hostname.endsWith("randstad.com.br")&&/\/vagas\/[^/?#]+_[^/?#]+\/?$/i.test(u.pathname))map.set(u.toString(),a)}catch{}}};
 add(first.text);
 const perPage=Math.max(1,map.size||10),pages=Math.min(130,Math.max(1,Math.ceil((total||perPage)/perPage)));
 for(let p=2;p<=pages;p++){try{const r=await fetchText(randstadPageUrl(source,p),18000);const before=map.size;add(r.text);if(map.size===before&&p>3)break}catch{break}}
 const base=[...map.values()].slice(0,1300),jobs:any[]=[];
 for(let i=0;i<base.length;i+=8)jobs.push(...await Promise.all(base.slice(i,i+8).map(x=>enrichJob(x,"randstad"))));
 return {jobs,total:total||jobs.length};
}

function collectAnchors(html: string, base: URL, provider: string) {
  const out: Array<{url:string,title:string}> = [];
  const seen = new Set<string>();
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const u = new URL(m[1], base);
      if (!/^https?:$/.test(u.protocol)) continue;
      u.hash = "";
      const key = u.toString();
      if (seen.has(key)) continue;
      const title = stripTags(m[2]).slice(0, 240);
      if (!likelyJob(key, title, provider, base.hostname)) continue;
      seen.add(key);
      out.push({ url:key, title });
    } catch {}
  }
  return out;
}

function collectEmbeddedUrls(html: string, base: URL, provider: string) {
  const out: Array<{url:string,title:string}> = [];
  const seen = new Set<string>();
  const rawUrls = html.match(/https?:\\?\/\\?\/[^"'<>\\\s]+/gi) || [];
  for (const candidate of rawUrls) {
    try {
      const clean = candidate.replace(/\\\//g, "/").replace(/&amp;/g, "&");
      const u = new URL(clean, base);
      u.hash = "";
      const url = u.toString();
      if (seen.has(url) || !likelyJob(url, "", provider, base.hostname)) continue;
      seen.add(url);
      out.push({url,title:""});
    } catch {}
  }
  return out;
}

function allJsonLd(value: any, out: any[] = []) {
  if (!value) return out;
  if (Array.isArray(value)) {
    for (const x of value) allJsonLd(x,out);
    return out;
  }
  if (typeof value === "object") {
    const type = value["@type"];
    if (type === "JobPosting" || (Array.isArray(type) && type.includes("JobPosting"))) out.push(value);
    for (const v of Object.values(value)) if (v && typeof v === "object") allJsonLd(v,out);
  }
  return out;
}

function parseJsonLdJobs(html: string) {
  const found:any[] = [];
  const re=/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m:RegExpExecArray|null;
  while((m=re.exec(html))){
    try{ allJsonLd(JSON.parse(m[1]),found); }catch{}
  }
  return found;
}

function parseYappCareerPage(html:string, source:URL){
  const m=/window\.__remixContext\s*=\s*([\s\S]*?);\s*<\/script>/i.exec(html);
  if(!m)return {jobs:[],total:0,size:10};
  let ctx:any=null;
  try{ctx=JSON.parse(m[1])}catch{return {jobs:[],total:0,size:10}}
  const route=ctx?.state?.loaderData?.["pages/public/career/route"]||{};
  const jobRoot=route?.jobs||{};
  const list=Array.isArray(jobRoot?.jobs)?jobRoot.jobs:[];
  const total=Number(jobRoot?.pagination?.total||route?.total||list.length||0);
  const size=Number(route?.size||10)||10;
  const jobs=list.map((j:any)=>{
    const slug=String(j?.slug||"").trim();
    const code=String(j?.job_code||"").trim();
    const url=(slug&&code)?new URL("/vagas/"+slug+"-"+code,source.origin).toString():"";
    const scenario=j?.job_hiring_scenario||{};
    const work=String(scenario?.work_model||"").toUpperCase();
    const modalidade=work==="REMOTE"?"Remoto":work==="HYBRID"?"Híbrido":work==="ONSITE"?"Presencial":"";
    const rawContract=String(scenario?.contract_type||"").toUpperCase();
    const contrato=rawContract==="SCHOLAR"?"Estágio":rawContract==="TEMPORARY"?"Temporário":rawContract==="PJ"?"PJ":rawContract==="CLT"?"CLT":rawContract;
    return {
      url,
      title:String(j?.job_title||"Vaga integrada").trim(),
      cidade:String(scenario?.city||"").trim(),
      estado:String(scenario?.state||"").trim(),
      contrato,
      modalidade,
      area:String(j?.job_publication?.category||"").trim(),
      senioridade:String(j?.seniority_level||"").trim(),
      opening_date:String(j?.job_schedule?.opening_date||"").slice(0,10),
      confidential:j?.is_confidential===true
    };
  }).filter((x:any)=>x.url);
  return {jobs,total,size};
}

function extractHeadingSectionHtml(html:string, headings:string[]){
  for(const heading of headings){
    const escaped=heading.replace(/[.*+?^$()|[\]\\]/g,"\\$&");
    const re=new RegExp('<h[1-6]\\b[^>]*>\\s*'+escaped+'\\s*<\\/h[1-6]>([\\s\\S]*?)(?=<h[1-6]\\b|<\\/main>|<\\/article>|$)','i');
    const m=re.exec(html);
    if(m?.[1])return m[1];
  }
  return "";
}
function splitYappProfileBenefits(html:string){
  const profileHtml=extractHeadingSectionHtml(html,["Perfil comportamental","Perfil Comportamental"]);
  if(!profileHtml)return {perfil:"",beneficios:""};
  const t=stripTags(profileHtml),p=t.search(/Benef[ií]cios/i);
  return p>=0?{perfil:t.slice(0,p).trim(),beneficios:t.slice(p).trim()}:{perfil:t,beneficios:""};
}
async function enrichYappJob(base:any){
  const seed={...base};
  try{
    const {text:html}=await fetchText(base.url,14000);
    const job=parseJsonLdJobs(html)[0]||null;
    const responsabilidades=stripTags(extractHeadingSectionHtml(html,["Principais responsabilidades","Responsabilidades","Atividades"]));
    const requisitosTecnicos=stripTags(extractHeadingSectionHtml(html,["Requisitos técnicos","Requisitos","Requisitos e qualificações"]));
    const perfilPartes=splitYappProfileBenefits(html);
    let descricao="",cidade=String(base.cidade||""),estado=String(base.estado||""),cep="",salario="",data_encerramento="";
    let contrato=String(base.contrato||""),modalidade=String(base.modalidade||"");
    if(job){
      const resumo=stripTags(job.description||"").slice(0,12000);
      descricao=[resumo,responsabilidades?("Principais responsabilidades\n"+responsabilidades):""].filter(Boolean).join("\n\n").slice(0,30000);
      const loc=firstLocation(job);cidade=loc.cidade||cidade;estado=loc.estado||estado;cep=loc.cep||"";
      salario=salary(job);
      data_encerramento=String(job.validThrough||"").slice(0,10);
      if(!contrato)contrato=employment(job);
      const jl=String(job.jobLocationType||"").toUpperCase();if(!modalidade&&jl.includes("TELECOMMUTE"))modalidade="Remoto";
    }else{
      const resumo=metaContent(html,"description")||metaContent(html,"og:description");
      descricao=[resumo,responsabilidades?("Principais responsabilidades\n"+responsabilidades):""].filter(Boolean).join("\n\n").slice(0,30000);
    }
    const requisitos=[requisitosTecnicos,perfilPartes.perfil?("Perfil comportamental\n"+perfilPartes.perfil):""].filter(Boolean).join("\n\n").slice(0,30000);
    const beneficios=String(perfilPartes.beneficios||"").slice(0,30000);
    const normalized={...seed,title:String(seed.title||job?.title||"Vaga integrada").replace(/\\s+/g," ").trim().slice(0,240),descricao,cidade,estado,cep,contrato,modalidade,data_encerramento,salario,requisitos,beneficios,provider:"yapp"};
    return {...normalized,key:await sha256(base.url),hash:await sha256(JSON.stringify(normalized))};
  }catch(err){
    console.warn("YAPP detalhe indisponível:",base?.url,String((err as Error)?.message||err));
    const core={...seed,provider:"yapp"};
    return {...core,key:await sha256(base.url),hash:await sha256(JSON.stringify(core))};
  }
}
async function extractYappJobs(source:URL){
  const first=await fetchText(source.toString(),18000);
  const p1=parseYappCareerPage(first.text,source);
  const out=[...p1.jobs];
  const pages=Math.min(30,Math.max(1,Math.ceil((p1.total||out.length)/(p1.size||10))));
  for(let p=2;p<=pages;p++){
    const u=new URL(source.toString());
    u.searchParams.set("page",String(p));
    try{
      const r=await fetchText(u.toString(),18000);
      const parsed=parseYappCareerPage(r.text,source);
      out.push(...parsed.jobs);
    }catch{}
  }
  const seen=new Set<string>();
  const unique:any[]=[];
  for(const j of out){
    if(!j.url||seen.has(j.url))continue;
    seen.add(j.url);
    unique.push(j);
  }
  const normalized:any[]=[];
  for(let i=0;i<unique.length;i+=6){
    normalized.push(...await Promise.all(unique.slice(i,i+6).map(j=>enrichYappJob(j))));
  }
  return {jobs:normalized,total:p1.total||normalized.length};
}

function firstLocation(job:any){
  const loc=Array.isArray(job?.jobLocation)?job.jobLocation[0]:job?.jobLocation;
  const a=loc?.address||{};
  return {
    cidade:String(a.addressLocality||"").trim(),
    estado:String(a.addressRegion||"").trim(),
    cep:String(a.postalCode||"").trim()
  };
}

function employment(job:any){
  const e=Array.isArray(job?.employmentType)?job.employmentType[0]:job?.employmentType;
  if(!e)return "";
  const s=String(e).replace(/_/g," ").toLowerCase();
  if(/full.?time|tempo integral/.test(s))return "CLT";
  if(/part.?time|meio per[ií]odo/.test(s))return "Parcial";
  if(/contract|tempor/.test(s))return "Temporário";
  if(/intern|est[aá]gio/.test(s))return "Estágio";
  return String(e);
}

function salary(job:any){
  const b=job?.baseSalary;
  if(!b)return "";
  const cur=String(b.currency||"BRL");
  const val=b.value||{};
  const min=val.minValue??val.value??"";
  const max=val.maxValue??"";
  if(min===""&&max==="")return "";
  const fmt=(n:any)=>Number(n).toLocaleString("pt-BR",{style:"currency",currency:cur==="BRL"?"BRL":cur});
  try{return max!==""?fmt(min)+" a "+fmt(max):fmt(min)}catch{return String(min)}
}

function metaContent(html:string,name:string){
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  const wanted=name.toLowerCase();
  for(const tag of tags){
    const n=/(?:name|property)\s*=\s*["']([^"']+)["']/i.exec(tag);
    const c=/content\s*=\s*["']([^"']*)["']/i.exec(tag);
    if(n&&c&&String(n[1]).toLowerCase()===wanted)return stripTags(c[1]);
  }
  return "";
}

async function sha256(text:string){
  const bytes=new TextEncoder().encode(text);
  const hash=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

async function fetchText(url:string, timeoutMs=15000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const r=await fetch(url,{
      redirect:"follow",
      signal:controller.signal,
      headers:{
        "User-Agent":"Mozilla/5.0 (+Empregos Conecta; automated-sync)",
        "Accept":"text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
      }
    });
    const text=await r.text();
    if(!r.ok)throw new Error("source_http_"+r.status);
    return {text,status:r.status,contentType:r.headers.get("content-type")||""};
  }finally{clearTimeout(timer)}
}

async function enrichJob(base:{url:string,title:string}, provider:string){
  let title=base.title, descricao="", cidade="", estado="", cep="", contrato="", modalidade="", data_encerramento="", salario="";
  try{
    const {text:html}=await fetchText(base.url,12000);
    const jobs=parseJsonLdJobs(html);
    const job=jobs[0];
    if(job){
      title=stripTags(job.title||title);
      descricao=stripTags(job.description||"").slice(0,30000);
      const loc=firstLocation(job);cidade=loc.cidade;estado=loc.estado;cep=loc.cep;
      contrato=employment(job);
      salario=salary(job);
      data_encerramento=String(job.validThrough||"").slice(0,10);
      const jl=String(job.jobLocationType||"").toUpperCase();
      if(jl.includes("TELECOMMUTE"))modalidade="Remoto";
    }else{
      const h1=/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
      const t=/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);
      title=stripTags(h1?.[1]||title||t?.[1]||"");
      descricao=metaContent(html,"description")||metaContent(html,"og:description");
    }
  }catch{}
  title=(title||"Vaga integrada").replace(/\s+/g," ").trim().slice(0,240);
  const normalized={
    url:base.url,title,descricao,cidade,estado,cep,contrato,modalidade,data_encerramento,salario,
    provider
  };
  return {...normalized,key:await sha256(base.url),hash:await sha256(JSON.stringify(normalized))};
}

async function extractSource(rawUrl:string, requestedProvider:string){
  const source=new URL(rawUrl);
  if(!/^https?:$/.test(source.protocol)||unsafeHost(source.hostname))throw new Error("url_not_allowed");
  const detected=providerFromHost(source.hostname);
  const provider=requestedProvider&&requestedProvider!=="auto"&&requestedProvider!=="portal"?requestedProvider:detected;

  if(provider==="solides"){
    const s=await extractSolidesJobs(source);
    return {provider:"solides",jobs:s.jobs,allowClose:s.jobs.length>0,extraction:"solides_pages",sourceTotal:s.total};
  }

  if(provider==="randstad"){
    const r=await extractRandstadJobs(source);
    return {provider:"randstad",jobs:r.jobs,allowClose:r.jobs.length>0,extraction:"randstad_pages",sourceTotal:r.total};
  }

  if(provider==="yapp"){
    const y=await extractYappJobs(source);
    return {provider:"yapp",jobs:y.jobs,allowClose:y.jobs.length>0,extraction:"yapp_remix",sourceTotal:y.total};
  }

  const {text:html}=await fetchText(source.toString(),18000);
  const map=new Map<string,{url:string,title:string}>();
  for(const a of collectAnchors(html,source,provider))map.set(a.url,a);
  for(const a of collectEmbeddedUrls(html,source,provider))if(!map.has(a.url))map.set(a.url,a);
  const baseJobs=[...map.values()].slice(0,300);
  if(!baseJobs.length){
    return {provider:provider==="generic"?"portal_generico":provider,jobs:[],allowClose:false,extraction:"no_links"};
  }
  const enriched:any[]=[];
  const detailLimit=Math.min(baseJobs.length,80);
  for(let i=0;i<detailLimit;i+=8){
    enriched.push(...await Promise.all(baseJobs.slice(i,i+8).map(x=>enrichJob(x,provider))));
  }
  for(let i=detailLimit;i<baseJobs.length;i++){
    const x=baseJobs[i];
    const normalized={url:x.url,title:(x.title||"Vaga integrada").slice(0,240),provider};
    enriched.push({...normalized,key:await sha256(x.url),hash:await sha256(JSON.stringify(normalized))});
  }
  return {provider:provider==="generic"?"portal_generico":provider,jobs:enriched,allowClose:true,extraction:"links"};
}
async function rpc(name:string,body:any){
  const r=await fetch(SUPABASE_URL+"/rest/v1/rpc/"+name,{method:"POST",headers:dbHeaders,body:JSON.stringify(body)});
  const text=await r.text();
  if(!r.ok)throw new Error(name+"_http_"+r.status+":"+text.slice(0,400));
  return text?JSON.parse(text):null;
}

async function rest(path:string,opts:any={}){
  const headers={...dbHeaders,...(opts.headers||{})};
  const r=await fetch(SUPABASE_URL+"/rest/v1/"+path,{...opts,headers});
  const text=await r.text();
  if(!r.ok)throw new Error("rest_http_"+r.status+":"+text.slice(0,400));
  return text?JSON.parse(text):null;
}

async function processQueueJob(q:any){
  const companyRows=await rest("empresas?id=eq."+encodeURIComponent(q.empresa_id)+"&select=id,user_id,nome,nome_fantasia,razao_social,cnpj,conecta_config");
  const company=companyRows?.[0];
  if(!company)throw new Error("empresa_not_found");
  const cfg=company.conecta_config||{};
  const sourceUrl=String(q.source_url||cfg.url||"").trim();
  if(!sourceUrl)throw new Error("source_url_missing");
  const provider=String(q.provider||cfg.sistema||"auto").toLowerCase();
  const extracted=await extractSource(sourceUrl,provider);
  const runAt=new Date().toISOString();
  const stats=await rpc("conecta_apply_sync",{
    p_empresa_id:q.empresa_id,
    p_jobs:extracted.jobs,
    p_provider:extracted.provider,
    p_run_at:runAt,
    p_allow_close:extracted.allowClose
  });
  return {...stats,discovered:extracted.jobs.length,provider:extracted.provider,extraction:extracted.extraction};
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return new Response(JSON.stringify({ok:false,error:"method_not_allowed"}),{status:405,headers:cors});
  if(!SUPABASE_URL||!SERVICE_KEY)return new Response(JSON.stringify({ok:false,error:"server_config_missing"}),{status:500,headers:cors});
  try{
    const body=await req.json().catch(()=>({}));
    const batch=Math.max(1,Math.min(Number(body?.batch||5),10));
    const enqueued=await rpc("conecta_enqueue_due",{p_limit:Math.max(batch*4,20)});
    const claimed=await rpc("conecta_claim_sync_jobs",{p_limit:batch})||[];
    const results:any[]=[];
    for(const q of claimed){
      try{
        const stats=await processQueueJob(q);
        await rest("conecta_sync_queue?id=eq."+encodeURIComponent(q.id),{
          method:"PATCH",
          headers:{Prefer:"return=minimal"},
          body:JSON.stringify({status:"success",finished_at:new Date().toISOString(),stats,error:null})
        });
        results.push({id:q.id,empresa_id:q.empresa_id,ok:true,stats});
      }catch(err){
        const msg=String((err as Error)?.message||err).slice(0,1500);
        const attempts=Number(q.attempts||1);
        const retry=attempts<4;
        await rest("conecta_sync_queue?id=eq."+encodeURIComponent(q.id),{
          method:"PATCH",
          headers:{Prefer:"return=minimal"},
          body:JSON.stringify(retry?{
            status:"pending",
            trigger_type:"retry",
            run_after:new Date(Date.now()+Math.pow(2,attempts-1)*5*60*1000).toISOString(),
            error:msg
          }:{
            status:"error",
            finished_at:new Date().toISOString(),
            error:msg
          })
        });
        await rest("empresas?id=eq."+encodeURIComponent(q.empresa_id),{
          method:"PATCH",
          headers:{Prefer:"return=minimal"},
          body:JSON.stringify({conecta_last_sync_status:retry?"retry":"error",conecta_last_sync_error:msg})
        });
        results.push({id:q.id,empresa_id:q.empresa_id,ok:false,retry,error:msg});
      }
    }
    return new Response(JSON.stringify({ok:true,enqueued,claimed:claimed.length,results,checked_at:new Date().toISOString()}),{headers:cors});
  }catch(err){
    return new Response(JSON.stringify({ok:false,error:"worker_error",message:String((err as Error)?.message||err)}),{status:500,headers:cors});
  }
});
