import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const headers = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Cache-Control":"no-store"};
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers});
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", {headers});
  if (req.method !== "POST") return out({error:"Método não permitido."},405);
  try {
    const body = await req.json();
    const cnpj = String(body.cnpj || "").replace(/\D/g, "");
    const password = typeof body.password === "string" ? body.password : "";
    if (cnpj.length !== 14 || !password || password.length > 1024) return out({error:"Credenciais inválidas."},401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const options = {auth:{persistSession:false,autoRefreshToken:false}};
    const admin = createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,options);
    const {data:company} = await admin.from("empresas").select("user_id").eq("cnpj",cnpj).maybeSingle();
    if (!company?.user_id) return out({error:"Credenciais inválidas."},401);
    const {data:identity} = await admin.auth.admin.getUserById(company.user_id);
    if (!identity?.user?.email) return out({error:"Credenciais inválidas."},401);
    const client = createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,options);
    const {data,error} = await client.auth.signInWithPassword({email:identity.user.email,password});
    if (error || !data.session || data.user?.id !== company.user_id) return out({error:"Credenciais inválidas."},401);
    return out({...data.session,user:data.user});
  } catch { return out({error:"Não foi possível iniciar o acesso."},503); }
});
