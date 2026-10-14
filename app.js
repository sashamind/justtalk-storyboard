const panels = document.getElementById('panels');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function refHTML(key){
  return (REFS[key] || []).map(r => `<figure><img src="${esc(r.src)}" alt="${esc(r.caption||'Референс')}" loading="lazy">${r.caption?`<figcaption>${esc(r.caption)}</figcaption>`:''}</figure>`).join('');
}

function variantHTML(id, v){
  const scenes = v.scenes.map((s,i) => {
    const key = `${id}-${i+1}`;
    const refs = refHTML(key);
    return `<article class="scene">
      <div class="shot">${frameHTML(key, s.name)}<div class="tc"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="name">${esc(s.name)}</span></div></div>
      <div class="body">
        <div><div class="lbl">Голос</div><p class="vo">${esc(s.vo)}</p><p class="ru">${esc(s.ru)}</p></div>
        ${s.os?`<div><div class="lbl">Текст на экране</div><span class="ost">${esc(s.os)}</span></div>`:''}
        <div><div class="lbl">Что происходит</div><p>${esc(s.vis)}</p></div>
        ${refs?`<div><div class="lbl">Референс</div><div class="ref">${refs}</div></div>`:''}
      </div>
    </article>`;
  }).join('');
  return `<section class="intro"><h2>${esc(v.title)}</h2><p>${esc(v.idea)}</p></section>
  <div class="scenes">${scenes}</div>`;
}

const order = ['common','a','b','c','d'];
order.forEach(id => {
  if(id === order[1]) panels.insertAdjacentHTML('beforeend', `<section class="panel boards"><h2 class="group">Условные варианты раскадровок</h2>${BOARDS_INTRO}</section>`);
  const sec = document.createElement('section');
  sec.className = 'panel'; sec.id = 'p-' + id;
  sec.innerHTML = id === 'common' ? COMMON : variantHTML(id, VARIANTS[id]);
  panels.appendChild(sec);
});
panels.insertAdjacentHTML('beforeend', `<section class="panel">${OUTRO}</section>`);

// Логотип: столбики играют при наведении, а после ухода курсора доигрывают цикл до исходного положения
const logo = document.querySelector('.logo');
const bars = logo.querySelectorAll('.brand');
logo.addEventListener('mouseenter', () => bars.forEach(b => b.classList.add('play')));
bars.forEach(b => b.addEventListener('animationiteration', () => { if(!logo.matches(':hover')) b.classList.remove('play'); }));

// Аудиопримеры: при запуске одного остальные ставятся на паузу
document.addEventListener('play', e => {
  document.querySelectorAll('audio').forEach(el => { if(el !== e.target) el.pause(); });
}, true);
