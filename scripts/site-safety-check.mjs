import fs from 'node:fs';
import vm from 'node:vm';

const fail=(m)=>{console.error('SITE SAFETY: '+m);process.exitCode=1};
const mustRead=(p)=>{if(!fs.existsSync(p)){fail('arquivo ausente: '+p);return ''}return fs.readFileSync(p,'utf8')};

const app=mustRead('novo/assets/js/app.js');
const html=mustRead('novo/index.html');
const css=mustRead('novo/assets/css/app.css');

try{new vm.Script(app,{filename:'novo/assets/js/app.js'});console.log('OK sintaxe app.js')}catch(e){fail('app.js nao compila: '+e.message)}

const requiredFunctions=['irPara','garantirPainelConectaEM','conectaAbaEM','renderPainelConectaEM'];
for(const n of requiredFunctions) if(!new RegExp('function\\s+'+n+'\\s*\\(').test(app)) fail('funcao critica ausente: '+n);

const requiredFiles=['novo/assets/js/app.js','novo/assets/css/app.css'];
for(const p of requiredFiles){
 const rel=p.replace('novo/','');
 if(!html.includes(rel)) fail('index.html nao referencia '+rel);
}

if(!html.includes('pagina-home')) fail('pagina-home ausente do index');
if(!app.includes('conecta-operation-bar')) fail('barra operacional do Conecta ausente');
if(!css.trim()) fail('app.css vazio');

if(process.exitCode) process.exit(process.exitCode);
console.log('SITE SAFETY: verificacoes basicas aprovadas');
