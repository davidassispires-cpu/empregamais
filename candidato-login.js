function emToggleCandidatePassword(button){
  var field=button.parentElement.querySelector('input');
  if(!field)return;
  var visible=field.type==='password';
  field.type=visible?'text':'password';
  button.setAttribute('aria-label',visible?'Ocultar senha':'Mostrar senha');
  button.setAttribute('aria-pressed',String(visible));
}
(function(){
  function setup(){
    var page=document.getElementById('pagina-login-candidato');
    var registration=document.querySelector('#pagina-cadastro-candidato form');
    var layout=page&&page.querySelector('.login-candidato-layout');
    if(!layout||!registration||page.dataset.dualForm)return;
    page.dataset.dualForm='true';
    var intro=layout.querySelector('.login-candidato-intro');
    if(intro)intro.remove();
    var login=layout.querySelector('.container-menor');
    login.classList.add('candidate-access-card');
    var title=login.querySelector('.login-tipo');
    title.textContent='Acesse sua conta';
    login.querySelector('.login-candidato-card-text').textContent='Acompanhe suas candidaturas e oportunidades.';
    login.querySelector('[type="submit"]').textContent='Entrar';
    var help=login.querySelector('.login-ajuda');if(help)help.remove();
    var card=document.createElement('section');
    card.className='candidate-access-card candidate-register-card';
    card.innerHTML='<h2>Crie sua conta grátis</h2><p class="candidate-card-description">Cadastre-se e encontre sua próxima oportunidade.</p>';
    card.appendChild(registration);
    layout.appendChild(card);
    registration.querySelector('[type="submit"]').textContent='Criar conta grátis';
    var details={cadCandNome:['Seu nome completo','name'],cadCandEmail:['Seu e-mail','email'],cadCandTelefone:['(31) 91234-5678','tel'],cadCandSenha:['Sua senha','new-password']};
    Object.keys(details).forEach(function(id){var field=document.getElementById(id);field.placeholder=details[id][0];field.autocomplete=details[id][1];if(id==='cadCandTelefone'){field.type='tel';field.previousElementSibling.textContent='Celular';}});
    var password=document.getElementById('cadCandSenha');
    var toggle=login.querySelector('.cand-password-toggle').cloneNode(true);
    var wrap=document.createElement('div');wrap.className='cand-password-wrap';
    password.parentNode.insertBefore(wrap,password);wrap.appendChild(password);wrap.appendChild(toggle);
    var confirm=document.createElement('div');confirm.className='grupo';
    confirm.innerHTML='<label for="cadCandSenhaConfirmar">Confirmar senha</label><div class="cand-password-wrap"><input class="campo" id="cadCandSenhaConfirmar" placeholder="Confirme sua senha" autocomplete="new-password" required type="password"></div>';
    confirm.querySelector('.cand-password-wrap').appendChild(toggle.cloneNode(true));
    registration.insertBefore(confirm,registration.querySelector('[type="submit"]'));
    var confirmation=confirm.querySelector('input');
    function validate(){confirmation.setCustomValidity(confirmation.value!==password.value?'As senhas informadas não são iguais.':'');}
    confirmation.addEventListener('input',validate);password.addEventListener('input',validate);
    var note=document.createElement('p');note.className='candidate-free-note';note.textContent='A candidatura é gratuita.';layout.after(note);
    var style=document.createElement('style');style.id='candidate-dual-form-style';
    style.textContent=`
#pagina-login-candidato{background:#f2eefb!important;padding-bottom:40px!important}
#pagina-login-candidato .page-header{display:none!important}
#pagina-login-candidato .cand-login-breadcrumb{max-width:1080px;margin:0 auto;padding:24px 0 16px!important}
#pagina-login-candidato .login-candidato-layout{display:grid!important;grid-template-columns:1fr 1fr!important;gap:24px!important;width:calc(100% - 48px)!important;max-width:1080px!important;margin:0 auto!important;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:visible!important;align-items:stretch!important}
#pagina-login-candidato .candidate-access-card{box-sizing:border-box!important;min-width:0!important;max-width:none!important;width:100%!important;margin:0!important;padding:36px!important;background:white!important;border:1px solid #e9e2f3!important;border-radius:18px!important;box-shadow:0 8px 28px #41266d08!important}
#pagina-login-candidato .candidate-access-card .form-card{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;display:flex;flex-direction:column;height:100%;border-radius:0!important}
#pagina-login-candidato .login-tipo,#pagina-login-candidato .candidate-register-card h2{display:block!important;margin:0 0 12px!important;padding:0!important;background:none!important;color:#29134c!important;font-size:28px!important;line-height:1.2!important;font-weight:800!important}
#pagina-login-candidato .login-candidato-card-text,#pagina-login-candidato .candidate-card-description{margin:0 0 26px!important;color:#777087!important;font-size:15px!important;line-height:1.6!important}
#pagina-login-candidato .grupo{margin:0 0 16px!important}
#pagina-login-candidato .grupo label{display:block;margin-bottom:7px;color:#35214e!important;font-weight:600;font-size:13px}
#pagina-login-candidato .campo{box-sizing:border-box!important;width:100%!important;min-height:48px!important;border:1px solid #ded5eb!important;border-radius:9px!important;background:#fff!important;color:#35214e!important;font-size:14px!important;padding:12px 14px!important}
#pagina-login-candidato .campo:focus{outline:2px solid #c4a5e6!important;outline-offset:2px}
#pagina-login-candidato .cand-password-wrap{position:relative}
#pagina-login-candidato .cand-password-wrap .campo{padding-right:48px!important}
#pagina-login-candidato .cand-password-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;width:34px;height:34px;color:#80768f;cursor:pointer}
#pagina-login-candidato .cand-password-toggle svg{width:22px;height:22px}
#pagina-login-candidato .btn[type=submit]{margin-top:10px!important;width:100%!important;min-height:50px!important;border:0!important;border-radius:9px!important;background:#7840af!important;color:#fff!important;box-shadow:none!important;font-size:15px!important;font-weight:700!important}
#pagina-login-candidato .btn[type=submit]:hover{background:#653394!important}
#pagina-login-candidato .login-senha-link{color:#7840af!important;display:block;margin-left:auto;margin-bottom:22px;font-size:13px}
#pagina-login-candidato .cand-login-security{margin-top:auto!important;padding-top:28px!important;border-top:1px solid #eee6f6!important;color:#82788f!important}
#pagina-login-candidato .login-container form{margin-bottom:30px}
#pagina-login-candidato .cep-candidato-ajuda-em{font-size:11px!important;line-height:1.45;color:#857c91!important;margin:6px 0 0}
#pagina-login-candidato .candidate-free-note{text-align:center;margin:20px 0 0;color:#80738f;font-size:13px}
@media(max-width:700px){#pagina-login-candidato .login-candidato-layout{grid-template-columns:1fr!important;width:calc(100% - 28px)!important;gap:16px!important}#pagina-login-candidato .candidate-access-card{padding:26px 22px!important}#pagina-login-candidato .cand-login-breadcrumb{padding:18px 14px!important}#pagina-login-candidato .login-tipo,#pagina-login-candidato .candidate-register-card h2{font-size:25px!important}#pagina-login-candidato .cand-login-security{margin-top:20px!important}}
`;
    document.head.appendChild(style);
    var original=window.mostrarPagina;
    if(typeof original==='function')window.mostrarPagina=function(name){if(name==='cadastro-candidato'||name==='cadastro-curriculo-v101')name='login-candidato';return original.apply(this,[name].concat(Array.prototype.slice.call(arguments,1)));};
    // Cover registration routes already opened while the document was loading.
    ['pagina-cadastro-candidato','pagina-cadastro-curriculo-v101'].forEach(function(id){var node=document.getElementById(id);if(node&&node.classList.contains('ativa')&&typeof window.mostrarPagina==='function')window.mostrarPagina('login-candidato');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
