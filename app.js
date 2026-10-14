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

// Эквалайзер-конструктор: 15 столбиков на постоянных местах по кругу собираются в логотип, голос, силуэт человека, дни, рост и галочку.
// Столбики не ездят по горизонтали: только растут, сжимаются или уходят в ноль, если образу нужны не все.
// В каждой колонке есть второй сегмент (обычно нулевой): из него силуэту достаётся голова отдельно от плеч.
(() => {
  const svg = document.querySelector('.eq-demo svg'); if(!svg) return;
  const N = 15, W = 7, X = i => 32.5 + i*12;
  const mk = i => { const r = document.createElementNS('http://www.w3.org/2000/svg','rect'); r.setAttribute('x', X(i)); r.setAttribute('width', W); r.setAttribute('rx', W/2); svg.appendChild(r); return r; };
  const bars = Array.from({length:N}, (_,i) => mk(i)), segs = Array.from({length:N}, (_,i) => mk(i));
  const along = (pts, x) => { for(let k=1;k<pts.length;k++){ const [x0,y0]=pts[k-1],[x1,y1]=pts[k]; if(x<=x1) return y0+(y1-y0)*(x-x0)/(x1-x0); } return pts[pts.length-1][1]; };
  const shapes = [
    { hold:1600, at:(i)   => ({cy:40, h:Math.abs(i-7)>1 ? 0 : i===7 ? 29 : 16}) },
    { hold:2200, at:(i,t) => ({cy:40, h:(8+30*Math.abs(Math.sin(i*1.7)+Math.sin(i*.6))/2)*(.75+.35*Math.sin(t/180+i*1.3))}) },
    { hold:1800, at:(i)   => { const dx = Math.abs(X(i)+W/2-120), top = dx<=54 ? 72-26*(1-(dx/54)**2) : 72, head = dx<16 ? 2.5*Math.sqrt(256-dx*dx) : 0;
        return {cy:(top+72)/2, h:72-top, cy2:22, h2:head}; } },
    { hold:1500, at:(i)   => ({cy:40, h:i%7===0?17:W}) },
    { hold:1500, at:(i)   => { const h=6+i*3.6; return {cy:66-h/2, h}; } },
    { hold:1500, at:(i)   => ({cy:along([[36,40],[84,60],[204,16]], X(i)+W/2), h:W}) },
  ];
  const ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2, MOVE = 750;
  const draw = (s, n, p, t) => bars.forEach((r,i) => {
    const q = ease(Math.min(1, Math.max(0, (p*MOVE - i*18)/(MOVE - N*18)))), a = shapes[s].at(i,t), b = shapes[n].at(i,t), m = (u,v) => u+(v-u)*q;
    const h = Math.max(0, m(a.h,b.h)), cy = m(a.cy,b.cy), h2 = Math.max(0, m(a.h2||0,b.h2||0)), cy2 = m(a.cy2??a.cy,b.cy2??b.cy);
    r.setAttribute('y', cy-h/2); r.setAttribute('height', h);
    segs[i].setAttribute('y', cy2-h2/2); segs[i].setAttribute('height', h2);
  });
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(0,0,0,0); return; }
  let s = 0, t0 = performance.now(), raf = 0;
  const tick = now => {
    let el = now - t0; const n = (s+1) % shapes.length;
    if(el > shapes[s].hold + MOVE){ s = n; t0 = now; el = 0; }
    draw(s, (s+1) % shapes.length, Math.max(0, el - shapes[s].hold)/MOVE, now);
    raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ t0 = performance.now(); raf = requestAnimationFrame(tick); } }).observe(svg);
  draw(0,0,0,0);
})();

// Календарь → плитки: месяц заполняется день за днём, складывается в дорожку из 29 плиток (дни 0–28),
// моки 0/14/28 поднимаются выше, сессии с коучем 1/7/15/21 темнее, отметка спокойно прыгает по этим ключевым дням.
(() => {
  const svg = document.querySelector('.cal-demo svg'); if(!svg) return;
  const NS = 'http://www.w3.org/2000/svg', N = 29, MOCK = [0,14,28], COACH = [1,7,15,21];
  const kind = i => MOCK.includes(i) ? 'c-mock' : COACH.includes(i) ? 'c-coach' : 'c-prac';
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
  const g = svg.appendChild(document.createElementNS(NS, 'g'));
  const tiles = Array.from({length:N}, () => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('rx', 2); g.appendChild(r); return r; });
  const label = el('text', {'font-size':12}), title = el('text', {x:120, y:16, 'font-size':12, 'text-anchor':'middle'}), dot = el('circle', {r:2.6});
  title.textContent = '28 days';
  const grid = i => ({x:79.5+(i%7)*12, y:11.5+Math.floor(i/7)*12, w:9, h:9});
  const track = i => ({x:7.8+i*7.8, y:50, w:6, h:6});
  const clamp = v => Math.min(1, Math.max(0, v)), ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
  // Фазы (мс, после появления сетки): заполнение 300–2600, сборка в дорожку 3000–3900, подъём 3900–4500, прыжки 4600–7300, затухание 8200–8800.
  // Перед ними APPEAR мс: серые клетки выпрыгивают диагональной волной от левого верхнего угла с лёгким перелётом.
  const APPEAR = 800, LOOP = 9000 + APPEAR, back = p => 1 + 2.70158*Math.pow(p-1,3) + 1.70158*Math.pow(p-1,2);
  const draw = T => {
    const t = T - APPEAR;
    const filled = Math.floor((t-300)/80), m = i => ease(clamp((t-3000-i*12)/(900-N*12))), rise = ease(clamp((t-3900)/600));
    tiles.forEach((r,i) => {
      const a = grid(i), b = track(i), q = m(i), lift = rise*(MOCK.includes(i) ? 12 : COACH.includes(i) ? 4 : 0);
      const sc = back(clamp((T - ((i%7)+Math.floor(i/7))*40)/380)), h = (a.h+(b.h-a.h)*q)*sc+lift, w = (a.w+(b.w-a.w)*q)*sc, off = (1-sc)*a.w/2;
      r.setAttribute('x', a.x+(b.x-a.x)*q+off); r.setAttribute('y', a.y+(b.y-a.y)*q-lift+off); r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('class', i<=filled ? kind(i) : 'c-empty');
    });
    const day = Math.min(28, Math.max(0, filled));
    label.textContent = 'Day ' + day; label.setAttribute('x', 172); label.setAttribute('y', 44);
    label.setAttribute('opacity', t<300 ? 0 : 1-m(0));
    title.setAttribute('opacity', rise);
    const STOPS = [0,1,7,14,15,21,28], hop = (t-4600)/450, j = Math.min(STOPS.length-1, Math.floor(hop)), f = hop-Math.floor(hop), on = t>=4600 && t<7600;
    const top = i => track(i).y - (MOCK.includes(i) ? 12 : COACH.includes(i) ? 4 : 0);
    if(on){ const k = STOPS[j], n = STOPS[Math.min(STOPS.length-1, j+1)], p = k===n ? 0 : ease(f), x0 = track(k).x+3, x1 = track(n).x+3;
      dot.setAttribute('cx', x0+(x1-x0)*p); dot.setAttribute('cy', top(k)+(top(n)-top(k))*p-5-Math.sin(Math.PI*p)*(6+(n-k)*.6)); }
    dot.setAttribute('opacity', on || (t>=7600 && t<8200) ? 1 : 0);
    g.setAttribute('opacity', 1-clamp((t-8200)/600)); title.setAttribute('opacity', rise*(1-clamp((t-8200)/600)));
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(7600 + APPEAR); return; }
  let start = 0, raf = 0;
  const tick = now => { draw((now-start) % LOOP); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ start = performance.now(); raf = requestAnimationFrame(tick); } }).observe(svg);
  draw(0);
})();

// 3D-примеры к «Календарь → плитки» (плитки и перекидной календарь): three.js подгружается с CDN один раз,
// только когда плашка показалась на экране; каждая плашка крутит свою анимацию, пока видна
(() => {
  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  let loading = null;
  const load = () => window.THREE ? Promise.resolve() : (loading ||= new Promise((ok, fail) => {
    const s = document.createElement('script'); s.src = THREE_URL; s.onload = ok; s.onerror = fail; document.head.appendChild(s);
  }));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  [['.cal3d-demo', () => mountCal3D, 6000], ['.calbook-demo', () => mountCalBook3D, 5200]].forEach(([sel, mount, stillAt]) => {
    const el = document.querySelector(sel); if(!el) return;
    let inst = null, raf = 0, start = 0;
    const tick = now => { inst.draw(now - start); raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if(!e.isIntersecting) return;
      load().then(() => {
        if(!inst){ inst = mount()(el); new ResizeObserver(() => { inst.resize(); if(still) inst.draw(stillAt); }).observe(el); }
        if(still){ inst.draw(stillAt); return; }
        start = performance.now(); raf = requestAnimationFrame(tick);
      }, () => { el.insertAdjacentHTML('beforeend', '<span class="demo-tag" style="top:auto;bottom:8px">Не удалось загрузить three.js</span>'); });
    }, {rootMargin:'200px'}).observe(el);
  });
})();

// Общий «живой» курсор для плашек: летит к цели по дуге с разгоном и торможением, наклоняется по ходу полёта
// (по касательной к дуге, с огибающей sin², так что к прилёту стоит ровно), умеет зажиматься (held) и коротко нажимать (click).
// Цели называются именами: пока имя то же, курсор не перезапускает полёт, даже если элемент под ним чуть сдвинулся.
function cursorRig(cur, DUR = 820){
  const clamp = v => Math.min(1, Math.max(0, v)), ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
  let name = '', from = [0, 0], to = from, ctrl = from, t0 = -1e9, pos = from, rot = 0, scale = 1, bend = 1, clickAt = -1e9;
  const rig = {
    held:false,
    get to(){ return to; },
    place(n, p){ name = n; pos = from = to = ctrl = p; t0 = -1e9; },
    go(n, p, now){ if(n === name) return; name = n; from = pos; to = p; t0 = now;
      const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2, dx = to[0] - from[0], dy = to[1] - from[1]; bend = -bend;
      ctrl = [mx - dy * .28 * bend, my + dx * .28 * bend]; },
    click(now){ clickAt = now; },
    move(now){
      const raw = clamp((now - t0) / DUR), p = ease(raw), q = 1 - p;
      pos = [q*q*from[0] + 2*q*p*ctrl[0] + p*p*to[0], q*q*from[1] + 2*q*p*ctrl[1] + p*p*to[1]];
      // ось стрелки в покое смотрит вверх-влево (≈ −117° с базовым наклоном −8°); доворот к касательной — через синус, не больше 40°
      const tx = 2*q*(ctrl[0] - from[0]) + 2*p*(to[0] - ctrl[0]), ty = 2*q*(ctrl[1] - from[1]) + 2*p*(to[1] - ctrl[1]);
      const env = Math.pow(Math.sin(Math.PI * raw), 2), far = Math.min(1, Math.hypot(to[0] - from[0], to[1] - from[1]) / 60);
      rot = Math.hypot(tx, ty) > .01 ? Math.max(-40, Math.min(40, 55 * Math.sin(Math.atan2(ty, tx) + 117 * Math.PI / 180))) * env * far : 0;
      const k = now - clickAt, press = k >= 0 && k < 260 ? Math.sin(Math.PI * k / 260) : 0;
      scale += (((rig.held ? .8 : 1) - .22 * press) - scale) * (rig.held ? .35 : .22);
      cur.style.transform = `translate(${pos[0]}px,${pos[1]}px) rotate(${rot - 8}deg) scale(${scale})`;
    },
  };
  return rig;
}

// Реальный коуч: в окне звонка у коуча «включается живое видео», курсор кликает по нему и раскрывает на всё окно,
// потом окно возвращается к двум плиткам и видео гаснет. Состояния окна — классы на плашке, курсор — общий cursorRig.
(() => {
  const el = document.querySelector('.coach-demo'); if(!el) return;
  const tile = el.querySelector('.coach');
  // Если задан COACH_MEDIA (data.js), вместо условного силуэта показываем настоящее фото или видео коуча
  if(typeof COACH_MEDIA === 'string' && COACH_MEDIA){
    const video = /\.(mp4|webm|mov)$/i.test(COACH_MEDIA), m = document.createElement(video ? 'video' : 'img');
    m.className = 'shot'; m.src = COACH_MEDIA; m.alt = '';
    if(video) Object.assign(m, {muted:true, loop:true, autoplay:true, playsInline:true});
    tile.classList.add('has-shot'); tile.querySelector('.video').after(m);
    if(typeof COACH_MEDIA_NOTE === 'string' && COACH_MEDIA_NOTE) el.insertAdjacentHTML('beforeend', `<span class="demo-tag" style="top:auto;bottom:6px;left:auto;right:10px">${COACH_MEDIA_NOTE}</span>`);
  }
  // курсор: влетает к плитке коуча, зажимает её (уменьшается), отпускает — плитка раскрывается на всё окно, курсор улетает
  const cur = el.querySelector('.cur'), rig = cursorRig(cur);
  const STEPS = [[0,'','out'],[1200,'on','out'],[2600,'on cur-on','tile'],[3400,'on cur-on hold','tile'],[3700,'on cur-on big','tile'],
    [4300,'on cur-on big','out'],[5200,'on big','out'],[6800,'on','out'],[8000,'','out']], LOOP = 9200;
  const point = n => { const d = el.getBoundingClientRect(), r = tile.getBoundingClientRect();
    return n === 'out' ? [d.width * .12, d.height + 20] : [r.left - d.left + r.width * .55, r.top - d.top + r.height * .45]; };
  let shown = null;
  const apply = (state, at, now) => { rig.go(at, point(at), now); if(state === shown) return; shown = state;
    el.className = 'demo coach-demo ' + state; rig.held = state.includes('hold'); };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ apply('on', 'out', 0); return; }
  let start = 0, raf = 0;
  const tick = now => { const t = (now - start) % LOOP; let s = STEPS[0]; for(const st of STEPS) if(t >= st[0]) s = st; apply(s[1], s[2], now); rig.move(now); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ start = performance.now(); raf = requestAnimationFrame(tick); } }).observe(el);
  rig.place('out', point('out')); apply('', 'out', 0); rig.move(0);
})();

// Счётчики: реальные цифры спринта по очереди — число прокручивается как одометр, подпись меняется,
// под ними появляется столько же элементов (дни — плитки, моки — столбики, коуч — точки, звонки — 22×3 точки)
(() => {
  const el = document.querySelector('.stat-demo'); if(!el) return;
  const STATS = [
    {n:28, label:'days', shape:'tile', cols:14},
    {n:3,  label:'live mocks', shape:'bar', cols:3},
    {n:7,  label:'sessions with your coach', shape:'dot', cols:7},
    {n:22, label:'practice days', shape:'tile', cols:11},
    {n:66, label:'AI calls · 3 a day', shape:'', cols:22},
    {n:3,  label:'months of practice', shape:'wide', cols:3},
  ], HOLD = 2000;
  el.innerHTML = '<div class="stat"><div class="odo"></div><div class="stat-lbl"></div><div class="stat-dots"></div></div>';
  const odo = el.querySelector('.odo'), lbl = el.querySelector('.stat-lbl'), dots = el.querySelector('.stat-dots');
  const cols = [0, 1].map(() => { const c = document.createElement('span'); c.className = 'odo-col';
    c.innerHTML = '<span class="strip">' + Array.from({length:10}, (_, d) => `<span>${d}</span>`).join('') + '</span>'; odo.appendChild(c); return c; });
  let shown = -1, swap = 0;
  const show = k => {
    if(k === shown) return; shown = k;
    const s = STATS[k], tens = Math.floor(s.n / 10), ones = s.n % 10;
    cols[0].classList.toggle('off', !tens);
    cols[0].firstChild.style.transform = `translateY(${-tens}em)`; cols[1].firstChild.style.transform = `translateY(${-ones}em)`;
    lbl.classList.add('out'); clearTimeout(swap); swap = setTimeout(() => { lbl.textContent = s.label; lbl.classList.remove('out'); }, 250);
    dots.className = 'stat-dots ' + s.shape; dots.style.gridTemplateColumns = `repeat(${s.cols}, auto)`;
    dots.innerHTML = Array.from({length:s.n}, () => '<i></i>').join('');
    requestAnimationFrame(() => requestAnimationFrame(() => [...dots.children].forEach((d, i) => { d.style.transitionDelay = i * Math.min(40, 900 / s.n) + 'ms'; d.classList.add('on'); })));
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ show(0); return; }
  let start = 0, raf = 0;
  const tick = now => { show(Math.floor((now - start) / HOLD) % STATS.length); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ start = performance.now() - HOLD * Math.max(0, shown); raf = requestAnimationFrame(tick); } }).observe(el);
  show(0);
})();

// Человечек и тень: у стены маленький человечек и большая тень; на тени загораются ярлыки опыта,
// человечек начинает говорить — ярлыки гаснут; затем он растёт до размера тени, а ярлыки перелетают в его облачко.
// Цикл замыкается без затемнения: в конце всё отматывается назад — облачко сдувается, ярлыки возвращаются на тень, человечек уменьшается.
(() => {
  const svg = document.querySelector('.shadow-demo svg'); if(!svg) return;
  const NS = 'http://www.w3.org/2000/svg', LOOP = 8600, BASE = 110, SH = {cx:152, h:96}; // пол — нижний край плашки
  const clamp = v => Math.min(1, Math.max(0, v)), ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2, lerp = (a, b, q) => a + (b - a) * q;
  const mk = (tag, cls, parent = svg) => { const e = document.createElementNS(NS, tag); if(cls) e.setAttribute('class', cls); parent.appendChild(e); return e; };
  // прозрачность ставим через style и домножаем на базовую из CSS-класса (f-shadow, f-mute, f-tag), иначе класс её перебьёт
  const set = (e, o) => { for(const k in o) e.setAttribute(k, o[k]); };
  const fade = (e, v) => { e.style.opacity = (e.dataset.o ??= getComputedStyle(e).opacity) * v; };
  const g = mk('g');
  // Человечек: голова, туловище, руки и ноги — скруглённые «таблетки»; класс цвета висит на группе,
  // чтобы у полупрозрачной тени не темнели места, где детали перекрываются
  const person = cls => { const p = mk('g', cls, g); return {g:p, head:mk('circle', '', p), torso:mk('rect', '', p),
    arms:[mk('path', 'arm', p), mk('path', 'arm', p)], legs:[mk('rect', '', p), mk('rect', '', p)]}; };
  const draw1 = (p, cx, h, wave = 0) => {
    // голова отделена от плеч чистым ровным зазором, как в пиктограммах, — без «шеи»
    // Плечо и рука сопрягаются: радиус верхних углов туловища равен радиусу руки (aw/2), и центр скругления у них общий.
    // Рука поворачивается вокруг этого центра, поэтому её верхний полукруг всегда совпадает с дугой плеча — без стыка.
    const tw = h*.29, tt = BASE - h*.715, th = h*.405, lw = h*.135, aw = h*.115, al = h*.39, rs = aw / 2;
    const r = h*.115; set(p.head, {cx, cy:BASE-h+r, r}); // голова круглая
    set(p.torso, {x:cx-tw/2, y:tt, width:tw, height:th, rx:rs});
    [-1, 1].forEach((sd, i) => {
      // ноги начинаются глубоко внутри туловища: скруглённый верх ног спрятан, переход в тело цельный;
      // толще внутрь: внешний край почти на месте (cx ± .1475h), между ногами узкий просвет
      set(p.legs[i], {x:cx + sd*h*.08 - lw/2, y:tt+th-h*.17, width:lw, height:BASE-(tt+th-h*.17), rx:lw/2});
      const ax = cx + sd*(tw/2 - rs), ay = tt + rs, ang = sd*-15 + (sd > 0 ? -wave : 0); // центр скругления плеча
      // рука — толстая линия с круглыми концами, слегка выгнутая наружу по дуге; круглый конец у плеча
      // центрирован в центре скругления плеча, так что сопряжение сохраняется при любом наклоне
      const t = ang * Math.PI / 180, dx = -Math.sin(t), dy = Math.cos(t), L = al - aw, bow = h * .028;
      const ex = ax + dx * L, ey = ay + dy * L, qx = ax + dx * L / 2 + sd * Math.cos(t) * bow, qy = ay + dy * L / 2 + sd * Math.sin(t) * bow;
      set(p.arms[i], {d:`M${ax} ${ay}Q${qx} ${qy} ${ex} ${ey}`, 'stroke-width':aw});
    });
  };
  const shadow = person('f-shadow'), fig = person('f-brand');
  const bubble = mk('rect', 'f-card', g), tail = mk('path', 'f-card', g);
  const words = [mk('rect', 'f-mute', g), mk('rect', 'f-mute', g)];
  // Подписи для зрителя страницы: что здесь тень, а что фигура; в финале — итог
  const cap = (txt, anchor) => { const e = mk('text', 'cap', g); e.textContent = txt; e.setAttribute('text-anchor', anchor); return e; };
  const capShadow = cap('your experience', 'end'), capFig = cap('your English', 'end'), capEnd = cap('you sound like yourself', 'start');
  // Ярлыки: тонкие строки, выровненные по левому краю и по центру туловища тени; в облачке — шире, с ровными полями
  const TAG = 4, GAP = 5, W_SH = [21, 14, 18], W_BU = [40, 27, 34], BLOCK = 3 * TAG + 2 * GAP;
  const tags = W_SH.map(() => ({base:mk('rect', 'f-tag', g), lit:mk('rect', 'f-brand', g)}));
  draw1(shadow, SH.cx, SH.h);
  const frame = T => {
    const t = ((T % LOOP) + LOOP) % LOOP;
    const back = (d, len) => 1 - ease(clamp((t - 6600 - d) / len)); // обратный ход 6600–7800 к первому кадру
    const appear = 1, speak = ease(clamp((t - 2000) / 350)) * back(0, 700), dim = clamp((t - 2200) / 400);
    const grow = ease(clamp((t - 3000) / 1600)) * back(100, 1200);
    fade(shadow.g, appear);
    const fx = lerp(80, SH.cx - 10, grow), fh = lerp(34, SH.h, grow);
    draw1(fig, fx, fh, 40 * speak * (1 - .4 * grow)); // говорит — поднимает руку
    set(capShadow, {x:SH.cx - SH.h*.15, y:BASE - SH.h + SH.h*.13}); fade(capShadow, 1 - clamp(grow * 2.5));
    set(capFig, {x:fx - fh*.2 - 4, y:BASE - fh + fh*.13 + 2}); fade(capFig, 1 - clamp(grow * 3));
    set(capEnd, {x:14, y:30}); fade(capEnd, clamp((grow - .7) / .3));
    const bx = lerp(fx + 10, 170, grow), by = lerp(BASE - 34 - 14, 6, grow), bw = lerp(30, 58, grow), bh = lerp(14, BLOCK + 16, grow);
    set(bubble, {x:bx, y:by, width:bw, height:bh, rx:Math.min(7, bh/2)}); fade(bubble, speak);
    set(tail, {d:`M${bx+8} ${by+bh-1}l-5 6 11-6z`}); fade(tail, speak);
    words.forEach((w, i) => { set(w, {x:bx+6, y:by+4+i*5, width:[12, 8][i], height:2.5, rx:1.25}); fade(w, speak * (1 - clamp(grow * 2))); });
    tags.forEach((tg, i) => {
      const lit = clamp((t - 700 - i * 350) / 250) * (1 - dim), q = ease(clamp((t - 3000 - i * 150) / 1400)) * back(i * 120, 1000);
      const torsoTop = BASE - SH.h * .715, torsoH = SH.h * .405, row = i * (TAG + GAP);
      const x = lerp(SH.cx - 10.5, bx + 9, q), y = lerp(torsoTop + (torsoH - BLOCK) / 2 + row, by + 8 + row, q), w = lerp(W_SH[i], W_BU[i], q);
      [tg.base, tg.lit].forEach(r => set(r, {x, y, width:w, height:TAG, rx:TAG/2}));
      fade(tg.base, appear * (1 - q)); fade(tg.lit, Math.max(lit, q));
    });
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ frame(6000); return; }
  let start = 0, raf = 0;
  const tick = now => { frame(now - start); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ start = performance.now(); raf = requestAnimationFrame(tick); } }).observe(svg);
  frame(0);
})();

// Курсор: окно выплывает, курсор влетает в кадр, наводится на строку (подсветка), нажимает Start (рябь), раскрывает карточку фокуса,
// указывает на неё и уходит; затем карточка прячется и окно уплывает. Позиции считаются по реальным элементам плашки.
// Движение живое: курсор летит по дуге с разгоном и торможением, наклоняется по ходу движения, при нажатии проминается.
(() => {
  const el = document.querySelector('.cur-demo'); if(!el) return;
  const cur = el.querySelector('.cur'), stage = el.querySelector('.stage'), wrap = el.querySelector('.stage-wrap'), btn = el.querySelector('.go');
  const T = {r1:el.querySelector('.r1'), go:el.querySelector('.go'), pop:el.querySelector('.pop')};
  // shown — окно на месте; без него окно спрятано (выплывает в начале цикла и уплывает в конце)
  const STEPS = [[0,'', 'out'], [100,'shown','out'], [1000,'shown cur-on','r1'], [1650,'shown cur-on hold press1','r1'], [1950,'shown cur-on hov1','r1'], [2600,'shown cur-on','go'],
    [3300,'shown cur-on hov2','go'], [3650,'shown cur-on hov2 click','go'], [3850,'shown cur-on hov2 open','go'], [4450,'shown cur-on open','pop'],
    [5200,'shown cur-on open hov3','pop'], [6400,'shown cur-on open','out'], [7200,'shown leave','out'], [7700,'','out']] /* курсор остаётся видимым, пока не улетит за нижний край */, LOOP = 8500, DUR = 820;
  const point = name => { const d = el.getBoundingClientRect();
    if(name === 'out') return [d.width * .95, d.height + 20];
    const r = T[name].getBoundingClientRect(), fx = name === 'r1' ? .72 : name === 'pop' ? .62 : .5;
    return [r.left - d.left + r.width * fx, r.top - d.top + r.height * .55]; };
  const CLICK = 3650, IN = 100, OUT = 7700;
  const clamp = v => Math.min(1, Math.max(0, v));
  const rig = cursorRig(cur); rig.place('out', point('out'));
  let shown = '';
  const apply = (cls, at, now) => { rig.go(at, point(at), now); const key = cls + '|' + at; if(key === shown) return; shown = key;
    rig.held = cls.includes('hold'); el.className = 'demo cur-demo ' + cls;
    if(cls.includes('click')){ rig.click(now); el.style.setProperty('--rx', rig.to[0] + 'px'); el.style.setProperty('--ry', rig.to[1] + 'px'); } };
  // Окно, покачивание, поворот на клике и нажатие кнопки — одной функцией от времени цикла, без CSS-переходов: так ничего не мигает
  const back = p => 1 + 2.70158*Math.pow(p-1,3) + 1.70158*Math.pow(p-1,2);
  const scene = t => {
    const a = back(clamp((t - IN) / 800)), d = clamp((t - OUT) / 500), vis = a * (1 - d * d);
    const sway = 2.5 * Math.sin(t / LOOP * Math.PI * 2), kick = 6 * Math.sin(Math.PI * clamp((t - CLICK) / 800));
    wrap.style.opacity = clamp((t - IN) / 400) * (1 - d);
    stage.style.transform = `translateY(${26 * (1 - vis)}px) scale(${.9 + .1 * vis}) rotateX(${14 + 40 * (1 - vis)}deg) rotateY(${-11 + sway + kick}deg) rotateZ(1.5deg)`;
    btn.style.transform = `scale(${1 - .07 * Math.sin(Math.PI * clamp((t - CLICK) / 240))})`;
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ apply('shown cur-on open hov3', 'pop', 0); rig.place('pop', point('pop')); rig.move(0); scene(5200); return; }
  let start = 0, raf = 0;
  const tick = now => { const t = (now - start) % LOOP; let s = STEPS[0]; for(const st of STEPS) if(t >= st[0]) s = st; apply(s[1], s[2], now); rig.move(now); scene(t); raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if(e.isIntersecting){ start = performance.now(); raf = requestAnimationFrame(tick); } }).observe(el);
  rig.move(0); scene(0);
})();

// Кинетический текст: ключевые фразы закадра по очереди собираются по словам (проявляются снизу), акценты — синим
// и крупно, «No scripts. No memorising.» зачёркивается; затем слова уходят вверх и появляется следующая фраза.
(() => {
  const el = document.querySelector('.kt-demo'); if(!el) return;
  const layers = [...el.querySelectorAll('.kt')]; let cur = 0; // два слоя: пока один уходит, во втором уже собирается следующая фраза
  // фраза: строки → слова [текст, классы]; step — шаг между словами, strike — зачеркнуть строки
  const PHRASES = [
    {step:110, lines:[[['Sound'],['as'],['good'],['in'],['English']], [['as','acc'],['you','acc'],['are','acc'],['at','acc'],['your','acc'],['job.','acc']]]},
    {step:160, lines:[[['28','big acc']], [['days']]]},
    {step:380, lines:[[['Real'],['questions.']], [['Follow-ups.']], [['Feedback.','acc']]]},
    {step:140, strike:true, lines:[[['No'],['scripts.']], [['No'],['memorising.']]]},
    {step:200, lines:[[['Just','mid'],['talk.','mid acc']]]},
  ], HOLD = 2700, OVERLAP = 220;
  const render = (box, k) => { const ph = PHRASES[k]; let i = 0;
    box.className = 'kt'; box.style.setProperty('--step', ph.step + 'ms');
    box.innerHTML = ph.lines.map(line => { const n = i + line.length;
      const words = line.map(([w, cls = '']) => `<span class="w ${cls}" style="--i:${i++}">${w}</span>`).join('');
      return `<span class="ln${ph.strike ? ' strike' : ''}" style="--n:${n}">${words}</span>`; }).join('');
    // подгоняем размер под ширину плашки: самая длинная строка должна влезать с полями
    box.style.setProperty('--fit', 1);
    const room = el.clientWidth - 40, widest = Math.max(...[...box.querySelectorAll('.ln')].map(l => l.scrollWidth));
    box.style.setProperty('--fit', Math.min(1, room / widest).toFixed(3)); };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ render(layers[0], 0); return; }
  let k = -1, timer = 0;
  const next = () => { k = (k + 1) % PHRASES.length; cur = 1 - cur; render(layers[cur], k);
    timer = setTimeout(() => { layers[cur].classList.add('out'); timer = setTimeout(next, OVERLAP); }, HOLD); };
  new IntersectionObserver(([e]) => { clearTimeout(timer); if(e.isIntersecting){ layers.forEach(l => { l.className = 'kt'; l.innerHTML = ''; }); k = k < 0 ? -1 : k - 1; next(); } }).observe(el);
})();
