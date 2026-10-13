const panels = document.getElementById('panels');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function refHTML(key){
  const list = REFS[key] || [];
  if(!list.length) return `<span class="tag">Референс</span><span>Пришлите картинку в чат<br>с пометкой «${esc(key.toUpperCase())}»</span>`;
  return list.map(r => `<figure><img src="${esc(r.src)}" alt="${esc(r.caption||'Референс')}" loading="lazy">${r.caption?`<figcaption>${esc(r.caption)}</figcaption>`:''}</figure>`).join('');
}

function variantHTML(id, v){
  const script = v.scenes.map(s => `<p>${esc(s.vo)}</p><p class="ru">${esc(s.ru)}</p>`).join('');
  const scenes = v.scenes.map((s,i) => {
    const key = `${id}-${i+1}`;
    return `<article class="scene">
      <div class="tc"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="t">${s.t}</span><span class="name">${esc(s.name)}</span></div>
      <div class="body">
        <div><div class="lbl">Голос</div><p class="vo">${esc(s.vo)}</p><p class="ru">${esc(s.ru)}</p></div>
        ${s.os?`<div><div class="lbl">Текст на экране</div><span class="ost">${esc(s.os)}</span></div>`:''}
        <div><div class="lbl">Что происходит</div><p>${esc(s.vis)}</p></div>
      </div>
      <div class="ref" data-key="${key}">${refHTML(key)}</div>
    </article>`;
  }).join('');
  return `<section class="intro"><div class="eyebrow">Вариант ${id.toUpperCase()}</div><h2>${esc(v.title.split('· ')[1])}</h2><p>${esc(v.idea)}</p></section>
  <div class="script">
    <div class="script-head"><div class="eyebrow">Закадр целиком</div><button class="btn copy" type="button" data-id="${id}">Скопировать для ElevenLabs</button></div>
    ${script}
  </div>
  <div class="scenes">${scenes}</div>`;
}

const order = ['common','a','b','c','d'];
order.forEach(id => {
  const sec = document.createElement('section');
  sec.className = 'panel'; sec.id = 'p-' + id; sec.setAttribute('role','tabpanel');
  sec.innerHTML = id === 'common' ? COMMON : variantHTML(id, VARIANTS[id]);
  panels.appendChild(sec);
});
document.querySelectorAll('.ref[data-key^="common"]').forEach(el => el.innerHTML = refHTML(el.dataset.key));

function show(id){
  if(!order.includes(id)) id = 'common';
  order.forEach(k => {
    document.getElementById('p-'+k).hidden = k !== id;
    document.getElementById('tab-'+k).setAttribute('aria-selected', k === id ? 'true' : 'false');
  });
  try{ localStorage.setItem('jt-tab', id) }catch(e){}
}
document.querySelectorAll('nav.tabs [data-panel]').forEach(b => b.addEventListener('click', () => { show(b.dataset.panel); history.replaceState(null,'','#'+b.dataset.panel); }));
let start = (location.hash||'').slice(1);
if(!order.includes(start)){ try{ start = localStorage.getItem('jt-tab') || 'common' }catch(e){ start = 'common' } }
show(start);

const ruBtn = document.getElementById('toggle-ru');
function setRu(hide){ document.body.classList.toggle('hide-ru', hide); ruBtn.textContent = hide ? 'Показать перевод' : 'Скрыть перевод'; try{ localStorage.setItem('jt-hide-ru', hide?'1':'0') }catch(e){} }
let hideRu = false; try{ hideRu = localStorage.getItem('jt-hide-ru') === '1' }catch(e){}
setRu(hideRu);
ruBtn.addEventListener('click', () => setRu(!document.body.classList.contains('hide-ru')));

document.addEventListener('click', e => {
  const b = e.target.closest('.copy'); if(!b) return;
  const text = VARIANTS[b.dataset.id].scenes.map(s => s.vo.replace(/^"|"$/g,'"')).join('\n\n');
  const done = () => { const t = b.textContent; b.textContent = 'Скопировано'; setTimeout(() => b.textContent = t, 1500); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done, () => fallback(text, b, done));
  } else fallback(text, b, done);
});
function fallback(text, b, done){
  const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); done(); }catch(e){ b.textContent = 'Выделите текст вручную'; }
  ta.remove();
}
