(function(){
'use strict';
const visuals=[
['Em avaliação','evaluation','#ac710b','#fff6e2','M8 4H5v17h9M8 3h8v4H8ZM8 11h5M8 15h3M21 21l-4-4M16 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8'],
['Em contato','contact','#086be6','#eaf4ff','M3 4h14v10H8l-5 4ZM10 17h6l5 4V10h-2M6 9h1M10 9h1M14 9h1'],
['Entrevista agendada','interview','#7436c5','#f4edff','M3 5h16v13H3ZM7 3v4M15 3v4M3 10h16M18 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8M18 16v2l1 1'],
['Aprovado','approved','#168257','#eaf8f0','M12 2l3 3 4 1 1 4 2 3-3 3-1 4-4 1-3 1-3-3-4-1-1-4-2-3 3-3 1-4 4-1ZM7 12l3 3 6-6'],
['Contratado','hired','#087e88','#eaf8fa','M8 7V4h8v3M3 7h18v14H3ZM8 13l3 3 5-5'],
['Reprovado','rejected','#c52e3f','#fff0f1','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8 8l8 8M16 8l-8 8']
];
const stages=window.EmpregaMaisEtapasCandidatura.etapas.map(stage=>visuals.find(item=>item[0]===stage.label));
const style=document.createElement('style');style.textContent=`
html body #emCandidateDetails .em-stage-native{display:none!important}
html body #emCandidateDetails .em-stage-cards{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;margin:10px 0 12px!important;width:100%!important}
html body #emCandidateDetails .em-stage-cards .em-stage-card{position:relative!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:9px!important;min-width:0!important;min-height:72px!important;margin:0!important;padding:10px!important;box-sizing:border-box!important;background:#fff!important;border:1px solid #d4e1ee!important;border-radius:9px!important;color:#17324e!important;box-shadow:none!important;cursor:pointer!important;text-align:left!important;white-space:normal!important;font:600 12px/1.4 Poppins,sans-serif!important}
html body #emCandidateDetails .em-stage-card .em-stage-icon{display:grid!important;place-items:center!important;width:34px!important;height:34px!important;flex:0 0 34px!important;border-radius:8px!important;background:var(--stage-bg)!important;color:var(--stage-color)!important;margin:0!important}
html body #emCandidateDetails .em-stage-card svg{width:22px!important;height:22px!important;margin:0!important;flex-shrink:0!important}
html body #emCandidateDetails .em-stage-card .em-stage-label{font:600 12px/1.4 Poppins,sans-serif!important;color:#17324e!important;overflow-wrap:normal!important;padding-right:5px!important}
html body #emCandidateDetails .em-stage-card[aria-pressed=true]{background:#edf6ff!important;border:2px solid #0874ed!important;padding:9px!important}
html body #emCandidateDetails .em-stage-card[aria-pressed=true]:after{content:'✓';position:absolute;right:5px;top:4px;width:15px;height:15px;display:grid;place-items:center;border-radius:50%;background:#086be6;color:white;font-size:10px}
html body #emCandidateDetails .em-stage-card:hover{border-color:#8ab9ed!important}html body #emCandidateDetails .em-stage-card:focus-visible{outline:3px solid #94c3fc!important;outline-offset:2px!important}html body #emCandidateDetails .em-stage-card:disabled{opacity:.5;cursor:wait!important}
html body #emCandidateDetails .em-stage-help{font:400 11px/1.5 Poppins,sans-serif!important;color:#637995!important;margin:0 0 12px!important}
@media(max-width:360px){html body #emCandidateDetails .em-stage-cards{grid-template-columns:1fr!important}}
`;document.head.appendChild(style);
function sync(select,grid){grid.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.stage===select.value));if(b.disabled!==select.disabled)b.disabled=select.disabled})}
function scan(){document.querySelectorAll('#emCandidateDetails select[data-gc27-stage]').forEach(select=>{
let grid=select.parentNode.querySelector('.em-stage-cards');if(grid&&grid._stageSelect===select){sync(select,grid);return}
if(grid)grid.remove();select.classList.add('em-stage-native');grid=document.createElement('div');grid.className='em-stage-cards';grid.setAttribute('role','group');grid.setAttribute('aria-label','Etapa da candidatura');grid._stageSelect=select;
stages.forEach(([label,key,color,bg,path])=>{if(!Array.from(select.options).some(o=>o.value===label))return;const b=document.createElement('button');b.type='button';b.className='em-stage-card';b.dataset.stage=label;b.style.setProperty('--stage-color',color);b.style.setProperty('--stage-bg',bg);b.innerHTML='<span class="em-stage-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg></span><span class="em-stage-label"></span>';b.querySelector('.em-stage-label').textContent=label;b.onclick=()=>{if(select.disabled)return;select.dataset.previousStage=select.value;select.value=label;select.dispatchEvent(new Event('change',{bubbles:true}));requestAnimationFrame(()=>sync(select,grid))};grid.append(b)});
select.after(grid);let note=select.parentNode.querySelector('.em-stage-help');if(!note){note=document.createElement('p');note.className='em-stage-help';note.textContent='Ao selecionar Entrevista agendada, informe a data e o horário.';grid.after(note)}sync(select,grid)
})}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})};new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});document.addEventListener('change',schedule);scan();
})();
