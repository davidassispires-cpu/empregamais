import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const headers = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Cache-Control":"no-store"};
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers});
const redirectTo = "https://davidassispires-cpu.github.io/empregamais/novo/?pagina=recuperar-senha&tipo=empresa";
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", {headers});
  if (req.method !== "POST") return out({error:"Método não permitido."},405);
  try {
    const {cnpj} = await req.json();
    const normalized = String(cnpj || "").replace(/\D/g, "");
    if (normalized.length !== 14) return out({ok:true});
    const options = {auth:{persistSession:false,autoRefreshToken:false}};
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,options);
    const {data:company} = await admin.from("empresas").select("user_id").eq("cnpj",normalized).maybeSingle();
    if (company?.user_id) {
      const {data:identity} = await admin.auth.admin.getUserById(company.user_id);
      if (identity?.user?.email) {
        const client = createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,options);
        await client.auth.resetPasswordForEmail(identity.user.email,{redirectTo});
      }
    }
    return out({ok:true});
  } catch { return out({error:"Não foi possível solicitar a recuperação."},503); }
});
