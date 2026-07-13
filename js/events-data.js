/* ------------------------------------------------------------------
   SHALOM — SÈL SOUS EVÈNMAN YO / SINGLE SOURCE OF TRUTH FOR EVENTS

   Pou ajoute yon evènman: kopye yon blòk, chanje enfòmasyon yo.
   To add an event: copy one block and change the details.

   Dat la DWE nan fòma 'YYYY-MM-DD' (ane-mwa-jou).
   The date MUST be 'YYYY-MM-DD'.

   Ou pa bezwen make yon evènman "pase" — sit la kalkile sa poukont li
   chak fwa yon moun vizite. Yon evènman ki pase disparèt otomatikman
   nan lis "K ap Vini" an.
   You never mark an event as past — the site works that out from the
   date on every visit, so nothing goes stale.
   ------------------------------------------------------------------ */

var SHALOM_EVENTS = [
  {
    date: '2026-07-20',
    time: '9:00 AM - 5:00 PM',
    title: 'Gran Konferans Lafwa &amp; Devlopman 2026',
    desc: 'Yon jounen konplè konsantre sou lafwa, devlopman pèsonèl, antreprenarya, ak vizyon pou Ayiti. Oratè envite, atelye pratik, ak netwòking. Pa manke evènman sa a!',
    location: 'Port-au-Prince, Ayiti',
    featured: true,
    register: 'https://wa.me/50946859702?text=Mwen%20vle%20enskri%20pou%20Gran%20Konferans%20Lafwa%20%26%20Devlopman%202026'
  },
  {
    date: '2026-07-06',
    time: '9:00 AM - 12:00 PM',
    title: 'Lansman Pwojè Agrikilti Faz 1',
    desc: 'Seremoni ofisyèl pou kòmanse Faz 1 pwojè agrikilti a. Benediksyon tè, prezantasyon plan, ak envitasyon pou patnè yo.',
    location: 'Sit Agrikòl Shalom'
  },
  {
    date: '2026-06-22',
    time: '2:00 PM - 6:00 PM',
    title: 'Konferans Biznis &amp; Lafwa',
    desc: 'Yon apremidi konsantre sou antreprenarya kretyen. Aprann kijan pou kòmanse yon biznis ak prensip biblik. Oratè envite ak panel diskisyon.',
    location: 'Shalom Tabernacle, Port-au-Prince'
  },
  {
    date: '2026-06-15',
    time: '10:00 AM - 1:00 PM',
    title: 'Sèvis Espesyal Dimanch',
    desc: 'Yon sèvis espesyal ak adorasyon, prediksyon, ak priyè pou kominote a. Tout moun envite vini ak fanmi yo.',
    location: 'Shalom Tabernacle, Port-au-Prince'
  },
  {
    date: '2026-05-18',
    time: '3:00 PM - 6:00 PM',
    title: 'Reyinyon Anyèl Manm yo',
    desc: 'Reyinyon anyèl kote manm yo te resevwa rapò sou pwogrè òganizasyon an, plan pou ane a, ak eleksyon nouvo komite.',
    location: 'Shalom Tabernacle, Port-au-Prince'
  },
  {
    date: '2026-04-20',
    time: '10:00 AM - 2:00 PM',
    title: 'Pak Espesyal &amp; Selebrasyon',
    desc: 'Sèvis espesyal pou selebre Pak. Adorasyon, mesaj espesyal, ak moman kominotè pou tout fanmi.',
    location: 'Shalom Tabernacle, Port-au-Prince'
  }
];

/* ---------- Motè a / the engine — pa bezwen touche sa a ---------- */

var SHALOM_MONTHS_HT = ['JAN','FEV','MAS','AVR','ME','JEN','JIY','OUT','SEP','OKT','NOV','DES'];

function shalomToday() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function shalomParse(iso) {
  var p = iso.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

function shalomDecorate(ev) {
  var d = shalomParse(ev.date);
  return {
    raw: ev,
    dateObj: d,
    month: SHALOM_MONTHS_HT[d.getMonth()],
    day: ('0' + d.getDate()).slice(-2),
    isPast: d < shalomToday()
  };
}

function shalomAll() {
  return SHALOM_EVENTS.map(shalomDecorate)
    .sort(function (a, b) { return a.dateObj - b.dateObj; });
}

function shalomUpcoming() {
  return shalomAll().filter(function (e) { return !e.isPast; });
}

function shalomPast() {
  return shalomAll().filter(function (e) { return e.isPast; })
    .sort(function (a, b) { return b.dateObj - a.dateObj; });
}

/* Kat evènman pou paj dakèy la / event card for the homepage */
function shalomHomeCard(e) {
  return '' +
    '<div class="event-card">' +
      '<div class="event-date">' +
        '<div class="month">' + e.month + '</div>' +
        '<div class="day">' + e.day + '</div>' +
      '</div>' +
      '<div class="event-info">' +
        '<h4>' + e.raw.title + '</h4>' +
        '<p>' + e.raw.time.split(' - ')[0] + ' — ' + e.raw.location + '</p>' +
      '</div>' +
    '</div>';
}

/* Paj dakèy: sèlman evènman k ap vini / homepage: upcoming only */
function shalomRenderHome(containerId, limit) {
  var box = document.getElementById(containerId);
  if (!box) return;
  var up = shalomUpcoming().slice(0, limit || 3);

  if (!up.length) {
    // Pito nou di laverite pase montre yon dat ki pase.
    // Better to say this honestly than to show a date that has already gone by.
    box.innerHTML =
      '<div class="event-card">' +
        '<div class="event-info">' +
          '<h4 data-i18n="events_none_title">Pwochen evènman yo ap anonse byento</h4>' +
          '<p data-i18n="events_none_sub">Kontakte nou sou WhatsApp pou ou pa manke anyen.</p>' +
        '</div>' +
      '</div>';
    return;
  }
  box.innerHTML = up.map(shalomHomeCard).join('');
}

/* Paj evènman: tout, ak bon etikèt / events page: all, correctly tagged */
function shalomRenderList(containerId) {
  var box = document.getElementById(containerId);
  if (!box) return;
  var items = shalomUpcoming().concat(shalomPast());

  box.innerHTML = items.map(function (e) {
    var past = e.isPast;
    return '' +
      '<div class="event-card' + (past ? ' past' : '') + '" data-type="' + (past ? 'past' : 'upcoming') + '">' +
        '<div class="event-date">' +
          '<div class="month">' + e.month + '</div>' +
          '<div class="day">' + e.day + '</div>' +
        '</div>' +
        '<div class="event-info">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">' +
            '<h4>' + e.raw.title + '</h4>' +
            '<span class="event-status ' + (past ? 'past-tag' : 'upcoming') + '">' +
              (past ? 'PASE' : 'K AP VINI') +
            '</span>' +
          '</div>' +
          '<p class="event-desc">' + e.raw.desc + '</p>' +
          '<div class="event-meta">' +
            '<span>&#128337; ' + e.raw.time + '</span>' +
            '<span>&#128205; ' + e.raw.location + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');
}

/* Evènman espesyal anlè paj la / featured block at the top of the events page.
   Li disparèt lè evènman an fin pase — li pa ret kole la.
   It disappears once the event is over instead of sitting there forever. */
function shalomRenderFeatured(containerId) {
  var box = document.getElementById(containerId);
  if (!box) return;
  var up = shalomUpcoming();
  var f = null, i;
  for (i = 0; i < up.length; i++) {
    if (up[i].raw.featured) { f = up[i]; break; }
  }
  if (!f) f = up[0];
  if (!f) { box.innerHTML = ''; return; }

  var ev = f.raw;
  var cta = ev.register
    ? '<a href="' + ev.register + '" target="_blank" rel="noopener" class="btn btn-gold">&#128221; Enskri Kounye a</a>'
    : '';

  box.innerHTML = '' +
    '<div class="featured-event">' +
      '<span class="featured-badge">&#11088; PWOCHEN EVÈNMAN</span>' +
      '<h2>' + ev.title + '</h2>' +
      '<div class="featured-event-meta">' +
        '<span>&#128197; ' + f.day + ' ' + SHALOM_MONTHS_HT[f.dateObj.getMonth()] + ' ' + f.dateObj.getFullYear() + '</span>' +
        '<span>&#128337; ' + ev.time + '</span>' +
        '<span>&#128205; ' + ev.location + '</span>' +
      '</div>' +
      '<p>' + ev.desc + '</p>' +
      '<div class="hero-ctas">' +
        cta +
        '<a href="contact.html" class="btn btn-outline-white">&#128172; Plis Enfòmasyon</a>' +
      '</div>' +
    '</div>';
}
