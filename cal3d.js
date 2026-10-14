/* ---------- Календарь → плитки в 3D (three.js, изометрия): сетка месяца 7×5 из 29 плиток-дней ----------
   Плитки прилетают сверху из-за кадра волной, заполняются цветом день за днём, моки 0/14/28 поднимаются выше всех, сессии с коучем 1/7/15/21 — до середины,
   по ключевым дням прыгает шарик, затем плитки уходят вниз и цикл повторяется. Цвета берутся из CSS-токенов страницы. */
function mountCal3D(el){
  const THREE = window.THREE;
  const N = 29, MOCK = [0,14,28], COACH = [1,7,15,21], STOPS = [0,1,7,14,15,21,28], LOOP = 8800;
  const clamp = v => Math.min(1, Math.max(0, v)), ease = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
  const back = p => 1 + 2.70158*Math.pow(p-1,3) + 1.70158*Math.pow(p-1,2);

  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputEncoding = THREE.sRGBEncoding;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100);
  camera.position.set(10, 10, 10); camera.lookAt(0, .5, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c6e0, .85));
  const sun = new THREE.DirectionalLight(0xffffff, .75);
  sun.position.set(4, 10, 2); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left:-7, right:7, top:7, bottom:-7}); sun.shadow.radius = 4;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({opacity:.12}));
  ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);

  // плитка со скруглёнными углами и мягкой фаской: скруглённый квадрат в плане, выдавленный вверх; основание на y = 0
  const S = .86, R = .16, B = .035, sh = new THREE.Shape(), h2 = S / 2 - B;
  sh.moveTo(-h2 + R, -h2); sh.lineTo(h2 - R, -h2); sh.quadraticCurveTo(h2, -h2, h2, -h2 + R); sh.lineTo(h2, h2 - R); sh.quadraticCurveTo(h2, h2, h2 - R, h2);
  sh.lineTo(-h2 + R, h2); sh.quadraticCurveTo(-h2, h2, -h2, h2 - R); sh.lineTo(-h2, -h2 + R); sh.quadraticCurveTo(-h2, -h2, -h2 + R, -h2);
  const geo = new THREE.ExtrudeGeometry(sh, {depth:1 - 2 * B, bevelEnabled:true, bevelThickness:B, bevelSize:B, bevelSegments:3, curveSegments:8});
  geo.rotateX(-Math.PI / 2); geo.translate(0, B, 0); geo.computeVertexNormals();
  const tiles = Array.from({length:N}, (_, i) => {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({roughness:.55, metalness:0}));
    const c = i % 7, r = Math.floor(i / 7);
    m.position.set((c - 3) * 1.05, 0, (r - 2) * 1.05); m.castShadow = m.receiveShadow = true;
    m.userData = {c, r, x:m.position.x, z:m.position.z};
    scene.add(m); return m;
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.24, 32, 16), new THREE.MeshStandardMaterial({roughness:.3}));
  ball.castShadow = true; scene.add(ball);

  // Цвета из токенов: пустая плитка — --line, практика / коуч / мок — --brand с разной плотностью на фоне --surface
  let C = {};
  const readColors = () => {
    // смешиваем в sRGB, как на странице, и только потом переводим в линейное пространство рендера
    const css = getComputedStyle(document.documentElement), tok = n => new THREE.Color(css.getPropertyValue(n).trim() || '#888');
    const brand = tok('--brand'), surface = tok('--surface'), lin = c => c.convertSRGBToLinear();
    C = {empty:lin(tok('--line')), prac:lin(surface.clone().lerp(brand, .35)), coach:lin(surface.clone().lerp(brand, .65)), mock:lin(brand.clone()), ball:lin(new THREE.Color('#ffffff'))};
    ball.material.color.copy(C.ball);
  };
  readColors();
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener && scheme.addEventListener('change', readColors);

  const kind = i => MOCK.includes(i) ? 'mock' : COACH.includes(i) ? 'coach' : 'prac';
  const lift = i => MOCK.includes(i) ? 1.9 : COACH.includes(i) ? .8 : .2;

  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight; if(!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h, H = Math.max(3.1, 7.6 / aspect);
    Object.assign(camera, {left:-H*aspect, right:H*aspect, top:H, bottom:-H}); camera.updateProjectionMatrix();
  };
  resize();

  // Фазы (мс): прилёт сверху 0–1450, заполнение 1200–3400, подъём 3600–4300, прыжки 4500–7200, улёт вниз за кадр 7700–8700.
  // Высоты прилёта и улёта (±12–14) больше половины видимой высоты кадра, так что плитки появляются и исчезают за его краем.
  const draw = T => {
    const t = ((T % LOOP) + LOOP) % LOOP, rise = ease(clamp((t - 3600) / 700));
    tiles.forEach((m, i) => {
      const {c, r} = m.userData;
      const p = (t - (c + r) * 70) / 550, out = clamp((t - 7700 - (c + r) * 40) / 600);
      const fall = p < 1 ? 12 * (1 - p * p) : p < 1.35 ? .35 * Math.sin((p - 1) / .35 * Math.PI) * (1 - (p - 1) / .35) : 0;
      m.visible = t >= (c + r) * 70;
      m.position.y = fall - 14 * out * out;
      m.castShadow = m.position.y > -.3 && m.position.y < .6; // в полёте тени не отбрасываем: иначе они падают на «пол» раньше самих плиток
      m.scale.y = .25 + rise * lift(i);
      m.material.color.copy(t >= 1200 + i * 75 ? C[kind(i)] : C.empty);
    });
    const top = i => tiles[i].position.y + tiles[i].scale.y;
    const hop = (t - 4500) / 450, j = Math.min(STOPS.length - 1, Math.max(0, Math.floor(hop)));
    const k = STOPS[j], n = STOPS[Math.min(STOPS.length - 1, j + 1)], p = t < 4500 || k === n ? 0 : ease(hop - Math.floor(hop));
    const a = tiles[k].userData, b = tiles[n].userData;
    ball.visible = t >= 4300 && t < 7700;
    ball.position.set(a.x + (b.x - a.x) * p, top(k) + (top(n) - top(k)) * p + .24 + Math.sin(Math.PI * p) * (.7 + (n - k) * .06), a.z + (b.z - a.z) * p);
    ball.scale.setScalar(ease(clamp((t - 4300) / 200)));
    renderer.render(scene, camera);
  };

  return {draw, resize};
}
