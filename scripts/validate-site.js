#!/usr/bin/env node
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..');
const skip=new Set(['node_modules','.git']);
function walk(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p,out);else if(e.isFile()&&p.endsWith('.js'))out.push(p)}return out}
const files=walk(path.join(root,'novo'));
let failed=false;
for(const file of files){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0){failed=true;console.error('\n[ERRO JS] '+path.relative(root,file));console.error((r.stderr||r.stdout).trim())}}
const app=path.join(root,'novo/assets/js/app.js');
if(fs.existsSync(app)){const size=fs.statSync(app).size;if(size>950000)console.warn('[ALERTA] app.js ultrapassou 950 KB: '+size+' bytes. Novas funcionalidades devem ir para módulos próprios.')}
if(failed)process.exit(1);
console.log('OK: '+files.length+' arquivos JavaScript passaram na validação de sintaxe.');
