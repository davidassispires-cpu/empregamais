function emToggleCandidatePassword(button){
  var field=document.getElementById('loginCandSenha');
  if(!field)return;
  var visible=field.type==='password';
  field.type=visible?'text':'password';
  button.setAttribute('aria-label',visible?'Ocultar senha':'Mostrar senha');
  button.setAttribute('aria-pressed',String(visible));
}
