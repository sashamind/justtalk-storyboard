/* ---------- «Перекидной календарь спринта» в 3D (three.js): объёмный настольный календарь в ракурсе 3/4 ----------
   Сценарий цикла: календарь всё время в кадре с пустым листом → на листе по одному появляются 28 квадратиков-дней
   (моки 14/28 выпуклее и ярче, коуч-дни 1/7/15/21 средние, практика светлая) → лист отгибается, отрывается от колец
   и, покачиваясь и изгибаясь, падает вниз за кадр, под ним «28 DAYS» → календарь делает полный оборот вокруг вертикальной оси, и на развороте (спиной к зрителю)
   всё тихо сбрасывается, так что он возвращается к зрителю снова с пустым листом. Цвета берутся из CSS-токенов страницы. */
function mountCalBook3D(el){
  const THREE = window.THREE;
  const LOOP = 8600, MOCK = [14,28], COACH = [1,7,15,21];
  const clamp = v => Math.min(1, Math.max(0, v)), ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
  const back = p => 1 + 2.70158*Math.pow(p-1,3) + 1.70158*Math.pow(p-1,2);

  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputEncoding = THREE.sRGBEncoding;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(22, 1, .1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc4cee0, .75));
  const key = new THREE.DirectionalLight(0xffffff, .8);
  key.position.set(-4, 7, 8); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -.0006; key.shadow.normalBias = .02;
  Object.assign(key.shadow.camera, {left:-5, right:5, top:5, bottom:-5}); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, .35); rim.position.set(6, 3, -4); scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({opacity:.1}));
  ground.rotation.x = -Math.PI/2; ground.position.y = -2.4; ground.receiveShadow = true; scene.add(ground);
  ground.material.depthWrite = false; // иначе оторванный лист «проваливается в пол», а не улетает за нижний край кадра

  // Скруглённые «пластилиновые» плашки: выдавленный скруглённый прямоугольник с фаской
  const rrect = (w, h, r) => { const s = new THREE.Shape(), x = -w/2, y = -h/2;
    s.moveTo(x+r, y); s.lineTo(x+w-r, y); s.quadraticCurveTo(x+w, y, x+w, y+r); s.lineTo(x+w, y+h-r); s.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    s.lineTo(x+r, y+h); s.quadraticCurveTo(x, y+h, x, y+h-r); s.lineTo(x, y+r); s.quadraticCurveTo(x, y, x+r, y); return s; };
  const slab = (w, h, d, r, b) => { const g = new THREE.ExtrudeGeometry(rrect(w-2*b, h-2*b, Math.max(.02, r-b)),
    {depth:Math.max(.001, d-2*b), bevelEnabled:true, bevelThickness:b, bevelSize:b, bevelSegments:5, curveSegments:12}); g.center(); return g; };
  const mat = (o = {}) => new THREE.MeshStandardMaterial(Object.assign({roughness:.5, metalness:0}, o));
  const mesh = (g, m) => { const x = new THREE.Mesh(g, m); x.castShadow = x.receiveShadow = true; return x; };

  const cal = new THREE.Group(); scene.add(cal);
  const M = {brand:mat(), page2:mat({roughness:.6}), ring:mat({roughness:.25, metalness:.35}), hole:mat({roughness:.9})};

  // Корпус: синяя подложка сзади и шапка сверху, листы под верхним, два кольца
  const PW = 3.1, PH = 2.75, TOP = .95;
  const backing = mesh(slab(3.3, 3.55, .28, .32, .1), M.brand); backing.position.set(0, -.3, -.42); cal.add(backing);
  const header = mesh(slab(3.3, .82, .5, .3, .12), M.brand); header.position.set(0, 1.33, -.08); cal.add(header);
  const sheetGeo = slab(PW, PH, .07, .28, .03);
  const under = mesh(sheetGeo, M.page2); under.position.set(0, TOP - PH/2, -.1); cal.add(under);
  const mid = mesh(sheetGeo, M.page2); mid.position.set(0, TOP - PH/2 - .02, -.02); cal.add(mid);
  // Кольца продеты через люверсы: металлическое колечко с тёмным отверстием на лицевой стороне шапки,
  // кольцо выходит из отверстия, перекидывается через верхний край и уходит в шапку сверху
  const FRONT = -.08 + .25;
  [-.95, .95].forEach(x => {
    const ring = mesh(new THREE.TorusGeometry(.26, .065, 16, 48), M.ring); ring.rotation.y = Math.PI/2; ring.position.set(x, 1.62, .05); cal.add(ring);
    const eyelet = mesh(new THREE.TorusGeometry(.12, .035, 12, 40), M.ring); eyelet.position.set(x, 1.39, FRONT); cal.add(eyelet);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(.1, 32), M.hole); hole.position.set(x, 1.39, FRONT + .002); cal.add(hole);
  });

  // Лист «28 DAYS»: текст на холсте как текстура, лежит на среднем листе
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 420;
  const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(PW*.9, PH*.85*.9), new THREE.MeshBasicMaterial({map:tex, transparent:true}));
  label.position.set(0, TOP - PH/2 - .05, .025); cal.add(label);

  // Верхний лист с 28 кнопками-днями висит на шарнире у верхнего края: так он перекидывается через кольца
  const hinge = new THREE.Group(); hinge.position.set(0, TOP, .07); cal.add(hinge);
  // Верхний лист — гибкая поверхность: сетка из рядов по высоте со скруглёнными углами, чтобы её можно было изгибать
  const topMat = mat({roughness:.6, side:THREE.DoubleSide});
  const R = .28, sheet = new THREE.PlaneGeometry(PW, PH, 1, 36); sheet.translate(0, -PH/2, 0);
  const sp = sheet.attributes.position;
  for(let v = 0; v < sp.count; v++){ const y = sp.getY(v), d = Math.min(-y, PH + y);
    if(d < R){ const x = sp.getX(v); sp.setX(v, x - Math.sign(x) * (R - Math.sqrt(R*R - (R-d)*(R-d)))); } }
  const base = Float32Array.from(sp.array);
  const top = mesh(sheet, topMat); top.position.z = .035; hinge.add(top);
  const curl = y => (y / PH) * (y / PH); // изгиб: низ листа отходит сильнее верха
  const bend = b => { for(let v = 0; v < sp.count; v++) sp.setZ(v, base[v*3+2] + b * curl(sp.getY(v))); sp.needsUpdate = true; sheet.computeVertexNormals(); };
  const keyGeo = slab(.3, .3, .1, .08, .035);
  const keys = Array.from({length:28}, (_, i) => {
    const k = mesh(keyGeo, mat()); const c = i % 7, r = Math.floor(i / 7);
    k.position.set((c - 3) * .4, -.62 - r * .44, .07); hinge.add(k); return k;
  });

  let C = {};
  const readColors = () => {
    const css = getComputedStyle(document.documentElement), tok = n => new THREE.Color(css.getPropertyValue(n).trim() || '#888');
    const brand = tok('--brand'), surface = tok('--surface'), line = tok('--line'), lin = c => c.clone().convertSRGBToLinear();
    const paper = surface.clone().lerp(new THREE.Color('#ffffff'), .6);
    C = {brand:lin(brand), paper:lin(paper), paper2:lin(paper.clone().lerp(line, .35)), off:lin(paper.clone().lerp(line, .9)),
      prac:lin(paper.clone().lerp(brand, .35)), coach:lin(paper.clone().lerp(brand, .65)), mock:lin(brand), hole:lin(tok('--ink').lerp(brand, .25)), ring:lin(line.clone().lerp(new THREE.Color('#9aa3b5'), .6))};
    M.brand.color.copy(C.brand); M.page2.color.copy(C.paper2); topMat.color.copy(C.paper); M.ring.color.copy(C.ring); M.hole.color.copy(C.hole);
    const g = canvas.getContext('2d'); g.clearRect(0, 0, 512, 420); g.textAlign = 'center'; g.fillStyle = '#' + brand.getHexString();
    g.font = '700 230px Unbounded, "Golos Text", system-ui, sans-serif'; g.fillText('28', 256, 255);
    g.font = '600 56px "JetBrains Mono", ui-monospace, monospace'; g.fillStyle = css.getPropertyValue('--muted').trim() || '#5a6788'; g.fillText('D A Y S', 256, 345);
    tex.needsUpdate = true;
  };
  readColors();
  document.fonts && document.fonts.ready.then(readColors);
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener && scheme.addEventListener('change', readColors);

  const kind = d => MOCK.includes(d) ? 'mock' : COACH.includes(d) ? 'coach' : 'prac';
  const pop = d => MOCK.includes(d) ? .16 : COACH.includes(d) ? .09 : .05;

  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight; if(!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const dist = Math.max(15, 13.5 / camera.aspect);
    camera.position.set(0, 1.4, dist); camera.lookAt(0, .05, 0); camera.updateProjectionMatrix();
  };
  resize();

  // Фазы (мс): пустой лист 0–400, квадратики 400–3360, отгиб 3600–4000, падение 4000–5300, «28 DAYS» до 6400,
  // оборот 6400–7900 (сброс на середине, когда календарь спиной), пустой лист до конца цикла.
  // Покачивания периодичны по LOOP, чтобы на стыке циклов ничего не дёргалось.
  const SPIN = 6400, SPIN_LEN = 1500, RESET = SPIN + SPIN_LEN / 2, w = n => Math.PI * 2 * n / LOOP;
  const draw = T => {
    const t = ((T % LOOP) + LOOP) % LOOP, reset = t >= RESET;
    cal.position.y = Math.sin(t * w(4)) * .07;
    cal.rotation.set(.08 + Math.sin(t * w(3)) * .03, -.5 + Math.sin(t * w(2)) * .07 + Math.PI * 2 * ease(clamp((t - SPIN) / SPIN_LEN)), 0);
    keys.forEach((k, i) => {
      const d = i + 1, q = clamp((t - 400 - i * 100) / 260), p = reset ? 0 : q;
      k.visible = p > 0; k.scale.setScalar(Math.max(.001, back(p)));
      k.material.color.copy(C[kind(d)]);
      k.userData.z = .07 + pop(d) * back(p);
    });
    // Отрыв: лист отгибается от колец (наклон и изгиб), затем срывается и падает с ускорением, уходя вбок,
    // покачиваясь по оси Z и «дыша» изгибом; квадратики сидят на листе и повторяют его изгиб
    const peel = reset ? 0 : ease(clamp((t - 3600) / 400)), s = reset ? 0 : clamp((t - 4000) / 1300);
    const b = .45 * peel + (s > 0 ? .25 * Math.sin(s * Math.PI * 3) * (1 - s * .4) : 0);
    hinge.position.set(.9 * s * s, TOP + .08 * peel - 8 * s * s, .07 + .35 * peel + .6 * s);
    hinge.rotation.set(-.22 * peel - .45 * s, 0, .12 * Math.sin(s * Math.PI * 2.5) + .3 * s);
    bend(b);
    keys.forEach(k => { const y = k.position.y; k.position.z = k.userData.z + b * curl(y); k.rotation.x = Math.atan(2 * b * y / (PH * PH)); });
    hinge.children.forEach(m => m.castShadow = peel === 0); // оторванный лист не затеняет «28 DAYS» под собой
    hinge.visible = s < 1;
    label.material.opacity = reset ? 0 : clamp((t - 3800) / 500);
    renderer.render(scene, camera);
  };

  return {draw, resize};
}
