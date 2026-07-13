/* ------------------------------------------------------------------
   SHALOM — VOYE FÒM YO / FORM DELIVERY

   Anvan sa, fòm yo te montre "Mèsi, nou resevwa l" men done a pa t
   ale okenn kote — li te pèdi nèt. Kounye a chak fòm louvri WhatsApp
   ak tout enfòmasyon an ladan l, epi moun nan jis peze SEND.

   Before this, the forms showed a "thank you, we received it" screen
   while the data went nowhere at all. Now every submission opens
   WhatsApp pre-filled and the person just presses send.
   ------------------------------------------------------------------ */

var SHALOM_WHATSAPP = '50946859702';

/* Si yon jou nou gen yon sèvè oswa yon Google Sheet, mete lyen an isit la
   epi done a ap voye la tou — otomatikman, san moun nan pa fè anyen.
   The day we have a server or a Google Sheet, put the URL here and the
   data is posted there too, with no action from the visitor. */
var SHALOM_FORM_ENDPOINT = '';

function shalomVal(id) {
  var el = document.getElementById(id);
  if (!el) return '';
  return (el.value || '').trim();
}

function shalomLang() {
  return localStorage.getItem('shalom-lang') || 'kr';
}

/* Bati mesaj WhatsApp la / build the WhatsApp message */
function shalomBuildMessage(title, fields) {
  var lines = [title, ''];
  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    if (f.value) lines.push(f.label + ': ' + f.value);
  }
  return lines.join('\n');
}

/* Voye done a / deliver the submission */
function shalomDeliver(kind, title, fields, onDone) {
  var payload = { kind: kind, submittedAt: new Date().toISOString() };
  for (var i = 0; i < fields.length; i++) payload[fields[i].key] = fields[i].value;

  // Backup path — only if an endpoint is configured. Never blocks the user.
  if (SHALOM_FORM_ENDPOINT) {
    try {
      fetch(SHALOM_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (err) { /* pa bloke moun nan / never block the visitor */ }
  }

  var text = shalomBuildMessage(title, fields);
  var url = 'https://wa.me/' + SHALOM_WHATSAPP + '?text=' + encodeURIComponent(text);

  // Louvri WhatsApp / open WhatsApp
  var win = window.open(url, '_blank');
  if (!win) window.location.href = url;   // pop-up bloke -> menm onglè a

  if (typeof onDone === 'function') onDone();
}

/* Tèks ki di moun nan peze SEND — se pa yon manti, nou pa gen li ankò
   jiskaske li peze. Tells the visitor to actually press send: we have
   NOT received anything until they do. */
var SHALOM_SEND_NOTE = {
  kr: 'Peze SEND nan WhatsApp la pou nou ka resevwa mesaj ou a.',
  fr: 'Appuyez sur ENVOYER dans WhatsApp pour que nous recevions votre message.',
  en: 'Press SEND in WhatsApp so that we actually receive your message.'
};

function shalomAddSendNote(containerId) {
  var box = document.getElementById(containerId);
  if (!box || box.querySelector('.shalom-send-note')) return;
  var p = document.createElement('p');
  p.className = 'shalom-send-note';
  p.style.cssText = 'margin-top:12px;font-weight:600;color:#B8922E;';
  p.textContent = SHALOM_SEND_NOTE[shalomLang()] || SHALOM_SEND_NOTE.kr;
  box.appendChild(p);
}
