/* ---------- Условные кадры раскадровки: абстрактные SVG-наброски 320×180 по ключу "вариант-номер сцены" ---------- */
const FRAMES = (() => {
  const x = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // Примитивы
  const R = (px,py,w,h,r,c) => `<rect x="${px}" y="${py}" width="${w}" height="${h}" rx="${r}" class="${c}"/>`;
  const C = (cx,cy,r,c) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${c}"/>`;
  const L = (x1,y1,x2,y2,c='s-line',sw=1.5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const T = (px,py,s,c='t-ink',size=11,anchor='start',w=600) => `<text x="${px}" y="${py}" class="${c}" font-size="${size}" text-anchor="${anchor}" font-weight="${w}">${x(s)}</text>`;

  // Детали
  const floor = () => L(16,150,304,150);
  const person = (cx,base,h,c) => { const r=h*.16, bw=h*.4, bh=h*.62;
    return C(cx,base-h+r,r,c) + `<path d="M${cx-bw/2} ${base}v${-(bh-bw/2)}a${bw/2} ${bw/2} 0 0 1 ${bw} 0v${bh-bw/2}z" class="${c}"/>`; };
  const eq = (px,base,hs,w=6,gap=4,c='f-brand') => hs.map((h,i) => R(px+i*(w+gap),base-h,w,h,w/2,c)).join('');
  const card = (px,py,w,h) => R(px,py,w,h,6,'f-card');
  const lines = (px,py,w,n,gap=7,c='f-mute') => Array.from({length:n},(_,i) => R(px,py+i*gap,w*[1,.75,.55,.85,.65,.9][i%6],3,1.5,c)).join('');
  const tagp = (px,py,w,c='f-tag') => R(px,py,w,8,4,c);
  const arrow = (x1,py,x2) => `<path d="M${x1} ${py}H${x2}m-5-4l5 4-5 4" class="s-arrow"/>`;
  const down = (cx,py) => `<path d="M${cx} ${py}v10m-4-4l4 4 4-4" class="s-arrow"/>`;
  const cursor = (px,py) => `<path transform="translate(${px} ${py})" d="M0 0V15l4-3.6 3 6.4 2.6-1.2-3-6.3H12z" class="f-cursor"/>`;
  const tiles = (px,base,n=29,w=6,gap=3.6,o={}) => { const {hi=[0,14,28],h=6,hh=14,on=0,pop=-1}=o;
    return Array.from({length:n},(_,i) => { const high=hi.includes(i), th=i===pop?22:high?hh:h;
      return R(px+i*(w+gap),base-th,w,th,Math.min(1.5,w/2),high?'f-brand':i<on?'f-tile-on':'f-tile'); }).join(''); };
  const callWin = (px,py,w,h,o={}) => { const ty=py+15, th=h-21, tw=(w-18)/2, rx=px+12+tw, ar=Math.min(tw,th)*.22;
    return R(px,py,w,h,8,'f-card') + C(px+9,py+8,2.2,'f-brand') + R(px+15,py+6.5,w*.25,3,1.5,'f-mute')
      + R(px+6,ty,tw,th,5,'f-dark') + R(rx,ty,tw,th,5,'f-dark')
      + C(px+6+tw/2,ty+th/2,ar,'f-brand') + C(rx+tw/2,ty+th/2,ar,'f-avatar')
      + (o.coach && tw>40 ? R(rx+4,ty+4,24,9,4.5,'f-brand') + T(rx+16,ty+10.6,'VIDEO','t-on',5.5,'middle') : ''); };
  const report = (px,py,w,h,lv=[2,2,3,3]) => R(px,py,w,h,8,'f-card') + R(px+8,py+8,w*.45,4,2,'f-ink')
    + lv.map((v,i) => { const ry=py+22+i*((h-28)/4), sx=px+w-8-36;
        return R(px+8,ry,w*.28,3,1.5,'f-mute') + [0,1,2,3].map(j => R(sx+j*9,ry-.5,7,4,2,j<v?'f-brand':'f-tile')).join(''); }).join('');
  const focus = (px,py,w,h,label='Proof Point') => R(px,py,w,h,7,'f-focus') + T(px+8,py+12,'FOCUS','t-brand',6) + T(px+8,py+h-8,label,'t-ink',9);
  const phone = (px,py,w,h,rows=3,done=2) => { const rh=(h-38)/rows;
    return R(px,py,w,h,10,'f-card') + R(px+w/2-8,py+5,16,3,1.5,'f-tile') + R(px+9,py+16,w*.4,4,2,'f-ink')
      + Array.from({length:rows},(_,i) => { const cy=py+30+i*rh+rh/2-2;
          return C(px+14,cy,4.5,'f-avatar') + R(px+23,cy-1.5,Math.max(4,w-46),3,1.5,'f-mute') + C(px+w-12,cy,4,i<done?'f-brand':'f-tile'); }).join(''); };
  const bubble = (px,py,w,h,c='f-card',side='l') => R(px,py,w,h,8,c)
    + (side==='l' ? `<path d="M${px+12} ${py+h-1}l-6 8 14-8z" class="${c}"/>` : `<path d="M${px+w-12} ${py+h-1}l6 8-14-8z" class="${c}"/>`);
  const wave = (px,cy,n,step,amp,hl=[-1,-1],c='f-mute') => Array.from({length:n},(_,i) => { const h=3+amp*Math.abs(Math.sin(i*1.3)+Math.sin(i*.37))/2;
    return R(px+i*step,cy-h/2,step*.55,h,1,i>=hl[0]&&i<=hl[1]?'f-brand':c); }).join('');
  const strike = (cx,py,s,size=20) => { const w=s.length*size*.56;
    return T(cx,py,s,'t-ink',size,'middle',700) + L(cx-w/2-4,py-size*.32,cx+w/2+4,py-size*.32,'s-brand',2.5); };
  const logo = (cx,py,size=26) => { const bw=size*.2, g=size*.14, tw=8*size*.56, total=bw*3+g*2+6+tw, sx=cx-total/2;
    return R(sx,py-size*.6,bw,size*.45,bw/2,'f-brand') + R(sx+bw+g,py-size*.78,bw,size*.8,bw/2,'f-brand') + R(sx+(bw+g)*2,py-size*.6,bw,size*.45,bw/2,'f-brand')
      + T(sx+bw*3+g*2+6,py,'JustTalk','t-ink',size,'start',700); };
  const pill = (cx,py,w,h,s,size=9) => R(cx-w/2,py,w,h,h/2,'f-brand') + T(cx,py+h/2+size*.35,s,'t-on',size,'middle');
  const calendar = (px,py,filled=28) => R(px,py,106,78,8,'f-card') + R(px+8,py+7,30,4,2,'f-ink')
    + Array.from({length:28},(_,i) => R(px+8+(i%7)*13,py+18+Math.floor(i/7)*14,10,10,2.5,i<filled?'f-brand':'f-tile')).join('');

  // Повторяющиеся кадры
  const strikes = () => strike(160,82,'No scripts.') + strike(160,116,'No memorising.');
  const packshot = () => logo(160,86) + pill(160,104,132,20,'Start with a $99 Audit') + T(160,146,'interview.justtalk.ai','t-mute',9,'middle',500);

  return {
    // ---- A ----
    'a-1': () => floor() + person(205,150,118,'f-shadow') + tagp(190,86,30) + tagp(190,100,22) + tagp(190,114,34)
      + person(100,150,50,'f-brand') + eq(85,94,[5,10,4,8,3],4,2.5)
      + R(124,118,14,2.5,1,'f-mute') + R(129,124,9,2.5,1,'f-mute') + R(135,130,6,2.5,1,'f-mute'),
    'a-2': () => person(62,160,66,'f-brand')
      + card(96,26,42,30) + eq(106,50,[8,14,10],5,3) + card(144,14,42,30) + C(165,29,8,'f-soft') + C(165,29,4,'f-brand') + card(192,26,42,30) + lines(199,36,28,3,6)
      + T(150,84,'a','t-mute',10) + T(170,96,'k','t-mute',8) + T(190,82,'e','t-mute',9) + T(206,100,'t','t-mute',7) + T(222,88,'s','t-mute',8) + T(176,112,'o','t-mute',7)
      + bubble(236,100,66,44) + T(246,118,'s  t','t-mute',7) + T(262,130,'a e','t-mute',6) + T(280,120,'k','t-mute',6),
    'a-3': () => eq(34,118,[26,44,62,48,30],8,4) + T(104,84,'Sound as good in English','t-ink',14,'start',700) + T(104,104,'as you are at your job.','t-brand',14,'start',700),
    'a-4': () => calendar(18,46,20) + arrow(132,86,148) + T(228,76,'28 days','t-brand',24,'middle',700) + tiles(156,116,29,3.2,1.8,{on:29}),
    'a-5': () => callWin(14,34,150,100,{coach:true}) + T(89,150,'Live mock interview','t-mute',8,'middle',500) + arrow(166,60,178)
      + report(180,16,126,82) + focus(196,110,110,36) + cursor(290,132),
    'a-6': () => R(16,20,150,140,10,'f-dark') + C(91,76,26,'f-avatar') + `<path d="M51 160a40 40 0 0 1 80 0z" class="f-avatar"/>`
      + R(24,28,34,11,5.5,'f-brand') + T(41,36,'VIDEO','t-on',6,'middle')
      + R(180,28,124,96,8,'f-card') + R(186,58,96,11,3,'f-soft') + lines(190,40,100,6,11) + T(242,146,'7 sessions with your coach','t-brand',8.5,'middle'),
    'a-7': () => T(160,16,'3 AI calls a day','t-ink',11,'middle') + phone(36,26,64,96,3,3) + phone(128,26,64,96,3,2) + phone(220,26,64,96,3,1)
      + T(300,140,'0 → 66','t-brand',11,'end') + tiles(22,162,29,6,3.6,{on:16}),
    'a-8': () => callWin(20,16,124,80,{coach:true}) + report(160,16,140,80,[3,3,4,3]) + T(160,120,'Retest. Refocus.','t-ink',13,'middle',700) + tiles(22,164,29,6,3.6,{on:15,pop:14}),
    'a-9': () => floor() + T(40,64,'Day 28','t-ink',20,'start',700) + person(196,150,104,'f-shadow') + person(184,150,104,'f-brand') + eq(169,38,[12,18,22,18,12],4,2.5),
    'a-10': strikes,
    'a-11': packshot,

    // ---- B ----
    'b-1': () => callWin(30,14,260,124,{coach:true}) + bubble(146,106,154,30,'f-card','r') + T(156,125,'Tell me about yourself.','t-ink',10.5) + R(286,115,1.5,13,0,'f-brand'),
    'b-2': () => R(140,140,40,36,6,'f-head') + C(160,84,66,'f-head')
      + card(112,46,44,30) + eq(122,70,[8,14,10],5,3) + card(164,46,44,30) + lines(171,56,30,3,6) + eq(137,128,[14,22,28,22,14],6,4),
    'b-3': () => C(52,84,34,'f-head') + eq(37,98,[12,18,22,18,12],4,3) + T(92,90,'Answer','t-ink',16,'start',700) + T(156,89,'Answer','t-ink',9)
      + callWin(196,36,112,96) + bubble(204,108,50,18) + T(212,120,'Answer','t-mute',6.5) + eq(112,134,[10,7,5,3,2],5,3),
    'b-4': () => callWin(12,48,84,60) + arrow(100,78,114) + calendar(120,40) + arrow(230,78,244) + tiles(250,100,29,1.4,.7,{h:5,hh:12,on:29})
      + T(160,160,'The Interview Sprint · 28 days','t-ink',11,'middle'),
    'b-5': () => T(160,18,'3 live mocks · 1 focus at a time','t-ink',11,'middle')
      + [[14,25],[128,159.4],[242,293.8]].map(([wx,tx]) => callWin(wx,30,64,44) + R(wx+10,84,44,12,6,'f-focus') + L(wx+32,98,tx,138,'s-brand',1)).join('')
      + tiles(22,156,29,6,3.6,{hh:16}),
    'b-6': () => R(24,10,96,160,12,'f-card') + R(64,15,16,3,1.5,'f-tile') + R(34,28,76,26,6,'f-soft') + lines(40,36,56,2,7) + R(34,60,76,22,6,'f-soft') + lines(40,67,48,2,6)
      + wave(36,98,18,4,12,[-1,-1],'f-brand') + R(34,114,76,44,6,'f-focus') + T(40,126,'FEEDBACK','t-brand',6) + lines(40,133,56,3,7)
      + T(140,56,'22 practice days','t-ink',14,'start',700) + T(140,76,'3 calls a day','t-brand',14,'start',700) + tiles(140,120,29,3.4,1.9,{on:29}) + cursor(112,128),
    'b-7': () => callWin(14,36,150,100,{coach:true}) + bubble(64,16,98,24,'f-card','r') + T(72,32,'New question?','t-ink',9.5)
      + report(180,36,126,84,[4,4,4,4]) + T(243,136,'Strong','t-brand',11,'middle',700) + T(160,166,'Day 28 · unseen questions','t-ink',11,'middle'),
    'b-8': strikes,
    'b-9': packshot,

    // ---- C ----
    'c-1': () => eq(120,144,[40,70,98,74,46],12,5) + T(40,50,'опыт','t-ink',14) + T(232,44,'経験','t-ink',15) + T(24,112,'Erfahrung','t-ink',12)
      + T(226,100,'experiencia','t-ink',12) + T(40,164,'expérience','t-mute',11) + T(236,150,'تجربة','t-ink',14),
    'c-2': () => eq(120,112,[40,70,98,74,46],12,5,'f-ghost') + eq(120,112,[10,16,22,15,9],12,5) + T(160,138,'Shorter answers.','t-ink',14,'middle',700) + T(160,158,'Safer words.','t-mute',10,'middle'),
    'c-3': () => eq(56,140,[30,52,74,56,34],12,5) + R(236,30,6,110,3,'f-tile') + R(236,62,6,78,3,'f-brand') + C(239,62,10,'f-knob')
      + `<path d="M262 76V52m-5 5l5-5 5 5" class="s-arrow"/>` + T(239,160,'VOL','t-mute',7,'middle') + cursor(243,66),
    'c-4': () => eq(24,120,[30,52,74,56,34],9,4) + arrow(96,84,118) + tiles(128,100,29,4,2,{on:29}) + T(215,134,'28 days to find your voice','t-ink',11,'middle'),
    'c-5': () => callWin(14,16,132,86,{coach:true}) + T(80,114,'Live mock interview','t-mute',8,'middle',500) + R(163,124,56,36,6,'f-hl') + wave(16,142,58,5,26,[30,40])
      + L(194,124,214,70,'s-brand',1.2) + focus(176,30,130,38,'One thing to work on') + cursor(200,112),
    'c-6': () => R(104,8,112,164,12,'f-card') + C(160,52,26,'f-soft') + C(160,52,17,'f-brand') + eq(153.5,58,[6,12,6],3,2,'f-white')
      + R(114,90,60,16,8,'f-tile') + R(146,112,60,16,8,'f-brand') + R(114,134,74,16,8,'f-focus') + T(122,145,'Follow-up?','t-brand',7)
      + T(20,90,'3 AI calls','t-ink',12,'start',700) + T(20,106,'a day','t-ink',12,'start',700) + T(228,92,'listens','t-mute',10) + T(228,108,'asks follow-ups','t-mute',9),
    'c-7': () => lines(28,34,64,3,8,'f-ghost') + down(60,62) + lines(28,84,64,3,8,'f-ink') + T(60,150,'Clearer','t-ink',10,'middle')
      + wave(124,44,6,4,16) + wave(172,44,6,4,16) + down(160,62) + wave(138,96,11,4,16,[-1,-1],'f-brand') + T(160,150,'Shorter pauses','t-ink',10,'middle')
      + eq(237,56,[10,22,8,18,6],6,4,'f-mute') + down(260,62) + eq(237,116,[20,26,30,26,20],6,4) + T(260,150,'Steadier','t-ink',10,'middle'),
    'c-8': strikes,
    'c-9': () => eq(137,62,[20,30,36,30,20],6,4) + logo(160,104) + pill(160,120,132,20,'Start with a $99 Audit'),

    // ---- D ----
    'd-1': () => floor() + person(215,150,128,'f-shadow') + person(110,150,46,'f-brand'),
    'd-2': () => floor() + person(215,150,128,'f-shadow') + tagp(199,84,32,'f-brand') + tagp(199,100,24,'f-brand') + tagp(199,116,36,'f-brand') + person(110,150,46,'f-brand'),
    'd-3': () => floor() + person(215,150,128,'f-shadow') + tagp(199,84,32) + tagp(199,100,24) + tagp(199,116,36) + person(110,150,46,'f-brand')
      + bubble(126,74,44,24) + R(134,82,14,3,1.5,'f-mute') + R(134,89,9,3,1.5,'f-mute'),
    'd-4': () => person(74,144,92,'f-shadow') + person(30,144,46,'f-brand') + tiles(20,150,29,6,3.6,{hh:6,on:1})
      + T(196,62,'The Interview Sprint','t-ink',14,'middle',700) + T(196,82,'28 days','t-brand',14,'middle',700),
    'd-5': () => callWin(14,22,140,96,{coach:true}) + T(84,134,'Live mock interview','t-mute',8,'middle',500) + person(256,166,130,'f-shadow')
      + tagp(240,98,30) + tagp(240,112,36,'f-brand') + tagp(240,126,24) + L(240,118,214,138,'s-brand',1.2) + focus(164,134,96,34) + cursor(270,110),
    'd-6': () => T(160,22,'3 AI calls a day','t-ink',11,'middle') + phone(36,40,44,76,3,3) + phone(250,40,44,76,3,1)
      + bubble(152,62,72,34) + lines(160,71,56,3,7) + person(130,150,50,'f-brand') + tiles(20,156,29,6,3.6,{hh:6,on:12}),
    'd-7': () => tiles(30,112,9,5,2,{hi:[4],hh:26,h:8}) + `<path d="M60.5 78V64m-4 4l4-4 4 4" class="s-arrow"/>` + T(60,140,'Retest.','t-ink',12,'middle',700)
      + R(124,58,48,26,6,'f-ghostcard') + focus(146,78,56,30,'New') + T(160,140,'Refocus.','t-ink',12,'middle',700)
      + person(242,112,34,'f-mute') + person(274,112,62,'f-brand') + T(260,140,'Grow.','t-ink',12,'middle',700),
    'd-8': () => floor() + person(170,150,118,'f-shadow') + person(158,150,118,'f-brand') + bubble(196,26,108,54)
      + tagp(206,36,40,'f-brand') + tagp(250,36,36,'f-brand') + tagp(206,49,30,'f-brand') + tagp(240,49,48,'f-brand') + tagp(206,62,44,'f-brand'),
    'd-9': strikes,
    'd-10': packshot,
  };
})();

function frameHTML(key, label){
  const draw = FRAMES[key];
  return `<svg class="frame" viewBox="0 0 320 180" role="img" aria-label="Условный кадр: ${String(label).replace(/"/g,'&quot;')}">${draw ? draw() : ''}</svg>`;
}
