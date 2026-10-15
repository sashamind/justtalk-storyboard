/* ---------- Референсы: добавляются по ключу "вариант-номер сцены" ---------- */
const REFS = {
  // "a-5": [{src:"refs/a5-1.jpg", caption:"Окно звонка + отчёт"}],
};

/* ---------- Реальный коуч: фото (jpg/png/webp) или короткое видео без звука (mp4/webm) для плашки «Реальный коуч» ----------
   Пусто — показывается условный силуэт на градиенте. Пример: 'refs/coach.mp4' */
// Сейчас стоит заглушка — стоковое видео Pexels «Casual businessman looking at camera and talking» (pexels.com/video/casual-businessman-looking-at-camera-and-talking-5941016/), не коуч JustTalk.
const COACH_MEDIA = 'refs/coach-placeholder.mp4', COACH_MEDIA_NOTE = 'стоковое видео-заглушка';

const VARIANTS = {
a:{
  title:"Вариант A",
  idea:"Проблема → обещание → как устроен спринт → результат.",
  scenes:[
   {t:"0:00–0:05",name:"Тень больше человека",vo:"You're great at your job... But in English, your answers can sound smaller than you are.",ru:"Вы отлично делаете свою работу... Но на английском ваши ответы могут звучать мельче, чем вы есть.",os:"",vis:"Простой 2D-человечек у светлой стены. За ним огромная уверенная тень, на ней всплывают обезличенные ярлыки опыта. Над головой эквалайзер из логотипа: низкий, рваный. Слова ответа выходят мелкими и съезжают."},
   {t:"0:05–0:09",name:"Мысли есть",vo:"The ideas are there... The words just don't come out the way you mean them.",ru:"Мысли есть... Просто слова выходят не такими, как вы задумали.",os:"",vis:"Над головой яркие карточки-мысли (схема, график, иконка проекта). На пути к облачку речи они рассыпаются в мелкие разрозненные буквы."},
   {t:"0:09–0:11",name:"Поворот",vo:"Let's change that.",ru:"Давайте это исправим.",os:"Sound as good in English / as you are at your job.",vis:"Столбики эквалайзера вытягиваются вверх и превращаются в буквы заголовка. Вторая строка синяя."},
   {t:"0:11–0:14",name:"Календарь → плитки",vo:"The Interview Sprint. Twenty-eight days.",ru:"Спринт подготовки к собеседованию. Двадцать восемь дней.",os:"28 days",vis:"Сетка месяца заполняется синим день за днём и складывается в 3D-дорожку из 29 плиток. Плитки 0, 14, 28 выше остальных. Счётчик 0 → 28."},
   {t:"0:14–0:20",name:"День 0 · мок и отчёт",vo:"Start with a live mock interview. Your coach turns it into one clear focus.",ru:"Начните с живого пробного интервью. Коуч превратит его в один понятный фокус.",os:"Live mock interview · Proof Point",vis:"Камера прыгает на плитку Дня 0, та раскрывается в два окна видеозвонка: слева человечек, справа отснятый коуч. Волна голоса стягивается в карточку отчёта с четырьмя шкалами (Language, Flow, Clarity, Interaction). Из отчёта выпадает карточка фокуса."},
   {t:"0:20–0:23",name:"Живой коуч",vo:"A real coach... who knows what interviewers listen for.",ru:"Живой коуч... который знает, к чему прислушиваются интервьюеры.",os:"7 sessions with your coach",vis:"Крупно реальная съёмка коуча: слушает, кивает, делает пометку. Рядом транскрипт ответа, в нём подсвечивается одна фраза."},
   {t:"0:23–0:30",name:"Практика",vo:"Then practise it every day, in short A.I. interview calls. Real questions. Follow-ups. Feedback after every answer.",ru:"Дальше отрабатывайте его каждый день в коротких тренировочных звонках с ИИ. Настоящие вопросы. Уточнения. Обратная связь после каждого ответа.",os:"3 AI calls a day",vis:"Карточка фокуса улетает вперёд. Камера скачет по плиткам практики, каждая переворачивается в экран телефона «Today»: три звонка, галочки. Три коротких слова — три прыжка. Счётчик звонков 0 → 66."},
   {t:"0:30–0:33",name:"Повторная проверка",vo:"Retest with your coach... and refocus.",ru:"Пройдите повторную проверку с коучем... и выберите новый фокус.",os:"Retest. Refocus.",vis:"Плитка Дня 14 поднимается, на Дне 15 снова окно с коучем. Шкалы отчёта подрастают, карточка фокуса меняется на новую."},
   {t:"0:33–0:38",name:"Человек = тень",vo:"By day twenty-eight, you sound like yourself. In English.",ru:"К двадцать восьмому дню вы звучите как вы сами. По-английски.",os:"Day 28",vis:"Возврат к стене. Человечек отвечает, эквалайзер высокий и ровный. Фигура растёт, пока не совпадёт с тенью по контуру."},
   {t:"0:38–0:42",name:"Зачёркивание",vo:"No scripts. No memorising...",ru:"Никаких заготовок. Никакой зубрёжки...",os:"No scripts. No memorising.",vis:"Слова появляются по одному и тут же зачёркиваются синей линией. Музыка уходит в брейкдаун."},
   {t:"0:42–0:46",name:"Пэкшот",vo:"Just talk.",ru:"Просто говорите.",os:"JustTalk · Start with a $99 Audit · interview.justtalk.ai",vis:"Зачёркнутые слова разлетаются, эквалайзер собирается в логотип JustTalk вместе с голосом. Затем без голоса: плашка с аудитом и адрес сайта."}
  ]},
b:{
  title:"Вариант B",
  idea:"Ролик открывается вопросом интервьюера.",
  scenes:[
   {t:"0:00–0:03",name:"Вопрос",vo:"\"Tell me about yourself.\"",ru:"«Расскажите о себе.»",os:"Tell me about yourself.",vis:"Упрощённый интерфейс видеозвонка. В облачке интервьюера печатается вопрос, курсор мигает."},
   {t:"0:03–0:06",name:"В голове",vo:"You've answered this a hundred times... in your head.",ru:"Вы отвечали на это сотню раз... в голове.",os:"",vis:"Камера уходит внутрь головы человечка: там идеальный ответ, быстрые карточки опыта, уверенный ровный эквалайзер."},
   {t:"0:06–0:09",name:"Вслух",vo:"Out loud, in English, it comes out smaller.",ru:"Вслух, по-английски, выходит мельче.",os:"",vis:"Ответ выходит наружу в окно звонка и сжимается: буквы мельчают, эквалайзер проседает."},
   {t:"0:09–0:13",name:"28 дней",vo:"The Interview Sprint changes that, in twenty-eight days.",ru:"Спринт подготовки к собеседованию меняет это за двадцать восемь дней.",os:"The Interview Sprint · 28 days",vis:"Окно звонка складывается в календарь, календарь — в дорожку из 29 плиток."},
   {t:"0:13–0:20",name:"Три мока",vo:"Three live mock interviews with a real coach. After each one, one clear thing to work on.",ru:"Три живых пробных интервью с настоящим коучем. После каждого — одна понятная задача.",os:"3 live mocks · 1 focus at a time",vis:"Загораются три высокие плитки: 0, 14, 28. На каждой короткая вспышка окна звонка с реальным коучем, из каждой выпадает одна карточка фокуса."},
   {t:"0:20–0:30",name:"Каждый день",vo:"And every day in between, short A.I. interview calls to practise it. Real questions. Real follow-ups. Instant feedback.",ru:"А каждый день между ними — короткие тренировочные звонки с ИИ, чтобы её отработать. Настоящие вопросы. Настоящие уточнения. Мгновенная обратная связь.",os:"22 practice days · 3 calls a day",vis:"Камера скачет по плиткам между моками. Экран телефона: карточка вопроса, затем уточняющий вопрос, под ответом появляется блок обратной связи. Три такта на три коротких фразы."},
   {t:"0:30–0:36",name:"Финальный мок",vo:"By the final mock, the questions are new... and you're ready.",ru:"К финальному интервью вопросы уже новые... а вы готовы.",os:"Day 28 · unseen questions",vis:"Плитка 28. В облачке интервьюера новый, незнакомый вопрос. Человечек отвечает спокойно, эквалайзер ровный. Шкалы отчёта доходят до Strong."},
   {t:"0:36–0:40",name:"Зачёркивание",vo:"No scripts. No memorising.",ru:"Никаких заготовок. Никакой зубрёжки.",os:"No scripts. No memorising.",vis:"Слова появляются и зачёркиваются."},
   {t:"0:40–0:45",name:"Пэкшот",vo:"Just talk.",ru:"Просто говорите.",os:"JustTalk · Start with a $99 Audit",vis:"Эквалайзер собирается в логотип, затем плашка с аудитом и адрес сайта."}
  ]},
c:{
  title:"Вариант C",
  idea:"Всё строится вокруг голоса и эквалайзера из логотипа: на английском голос становится тише, за 28 дней — ровнее и увереннее.",
  scenes:[
   {t:"0:00–0:04",name:"Свой язык",vo:"Your experience speaks for itself... in your own language.",ru:"Ваш опыт говорит сам за себя... на родном языке.",os:"",vis:"Крупный яркий эквалайзер. Вокруг всплывают слова об опыте на разных языках и алфавитах, уверенно и крупно."},
   {t:"0:04–0:09",name:"Тише",vo:"In English, your voice gets quieter. Shorter answers. Safer words.",ru:"По-английски ваш голос становится тише. Ответы короче. Слова осторожнее.",os:"Shorter answers. Safer words.",vis:"Слова переключаются на английский, столбики эквалайзера оседают. Две фразы печатаются и уменьшаются по такту."},
   {t:"0:09–0:11",name:"Громче",vo:"Let's turn it back up.",ru:"Давайте сделаем погромче.",os:"",vis:"Появляется регулятор громкости и уходит вверх, эквалайзер оживает."},
   {t:"0:11–0:16",name:"Столбики → дни",vo:"The Interview Sprint. Twenty-eight days to find your voice in English.",ru:"Спринт подготовки к собеседованию. Двадцать восемь дней, чтобы найти свой голос на английском.",os:"28 days to find your voice",vis:"Столбики эквалайзера ложатся на бок и превращаются в 29 плиток-дней."},
   {t:"0:16–0:22",name:"Мок и коуч",vo:"It starts with a live mock interview, and a coach who shows you exactly what to work on.",ru:"Всё начинается с живого пробного интервью и коуча, который точно покажет, над чем работать.",os:"Live mock interview",vis:"Плитка 0 раскрывается в окно звонка с реальным коучем. Запись голоса — длинная волна; коуч выделяет на ней один участок, он отделяется и становится карточкой фокуса."},
   {t:"0:22–0:29",name:"ИИ-интервьюер",vo:"Then you practise every day, in short calls with A.I. interviewers that listen, and ask follow-ups.",ru:"Дальше вы практикуетесь каждый день в коротких звонках с ИИ-интервьюерами, которые слушают и задают уточняющие вопросы.",os:"3 AI calls a day",vis:"Экран телефона. ИИ-интервьюер — пульсирующий круг из того же эквалайзера. Диалог пузырями, после ответа появляется уточняющий вопрос."},
   {t:"0:29–0:36",name:"Три изменения",vo:"Day by day, the answers get clearer. The pauses get shorter. Your voice gets steadier.",ru:"День за днём ответы становятся яснее. Паузы — короче. Голос — увереннее.",os:"Clearer · Shorter pauses · Steadier",vis:"Три такта: размытый текст ответа становится резким; паузы на волне схлопываются; эквалайзер выравнивается и растёт."},
   {t:"0:36–0:40",name:"Зачёркивание",vo:"No scripts. No memorising.",ru:"Никаких заготовок. Никакой зубрёжки.",os:"No scripts. No memorising.",vis:"Слова появляются и зачёркиваются."},
   {t:"0:40–0:45",name:"Пэкшот",vo:"Just talk.",ru:"Просто говорите.",os:"JustTalk · Start with a $99 Audit",vis:"Ровный высокий эквалайзер собирается в логотип вместе с голосом."}
  ]},
d:{
  title:"Вариант D",
  idea:"Метафора человечка и тени проговаривается прямо: опыт большой, а слова его пока не догоняют.",
  scenes:[
   {t:"0:00–0:04",name:"За ответом",vo:"Behind every answer, there's more than you're saying.",ru:"За каждым ответом стоит больше, чем вы говорите.",os:"",vis:"Человечек у стены, за ним огромная тень."},
   {t:"0:04–0:08",name:"Опыт",vo:"Years of work. Real results. Things you're proud of.",ru:"Годы работы. Реальные результаты. То, чем вы гордитесь.",os:"",vis:"На тени по одному загораются обезличенные ярлыки: проекты, цифры, достижения. Три фразы — три ярлыка."},
   {t:"0:08–0:11",name:"В тени",vo:"But in English, most of it stays in the shadow.",ru:"Но на английском почти всё это остаётся в тени.",os:"",vis:"Человечек начинает говорить: ярлыки гаснут, в его облачке остаются пара мелких слов."},
   {t:"0:11–0:17",name:"Дорожка",vo:"The Interview Sprint. In twenty-eight days, your words catch up with your experience.",ru:"Спринт подготовки к собеседованию. За двадцать восемь дней ваши слова догоняют ваш опыт.",os:"The Interview Sprint · 28 days",vis:"Под ногами разворачивается дорожка из 29 плиток. Человечек делает первый шаг."},
   {t:"0:17–0:22",name:"Мок и коуч",vo:"Start with a live mock interview. A real coach finds the one thing holding you back.",ru:"Начните с живого пробного интервью. Настоящий коуч найдёт то, что вас сдерживает.",os:"Live mock interview",vis:"Окно звонка с реальным коучем. На тени подсвечивается один ярлык, он отделяется и становится карточкой фокуса."},
   {t:"0:22–0:28",name:"Шаги",vo:"Then practise it every day, with short A.I. interview calls built around it.",ru:"Дальше отрабатывайте это каждый день в коротких тренировочных звонках с ИИ.",os:"3 AI calls a day",vis:"Человечек идёт по плиткам. На каждом шаге короткая вспышка телефона с тремя звонками. С каждым шагом его облачко слов растёт."},
   {t:"0:28–0:31",name:"Три слова",vo:"Retest. Refocus. Grow.",ru:"Проверка. Новый фокус. Рост.",os:"Retest. Refocus. Grow.",vis:"Три такта: поднимается плитка 14; карточка фокуса меняется; человечек заметно вырос."},
   {t:"0:31–0:37",name:"Совпадение",vo:"Until what you say is as big as what you've done.",ru:"Пока то, что вы говорите, не станет таким же большим, как то, что вы сделали.",os:"",vis:"Человечек и тень совпадают по контуру. Ярлыки опыта загораются уже в его облачке речи."},
   {t:"0:37–0:41",name:"Зачёркивание",vo:"No scripts. No memorising.",ru:"Никаких заготовок. Никакой зубрёжки.",os:"No scripts. No memorising.",vis:"Слова появляются и зачёркиваются."},
   {t:"0:41–0:46",name:"Пэкшот",vo:"Just talk.",ru:"Просто говорите.",os:"JustTalk · Start with a $99 Audit",vis:"Эквалайзер собирается в логотип вместе с голосом, затем плашка с аудитом."}
  ]}
};

const COMMON = `
<section class="intro">
  <div class="eyebrow">Для всех вариантов</div>
  <h2>Идея, визуал и звук</h2>
  <p>Главная мысль ролика: человек силён в своей работе, но на английском его ответы звучат мельче, чем его опыт. За 28 дней этот разрыв закрывается. Подготовка держится на двух вещах: сильный ИИ для ежедневной практики и живой коуч, настоящий человек, который слушает и задаёт фокус. Всё остальное объясняет, как именно. Ролик заканчивается названием бренда как выводом: <b>Just talk.</b></p>
</section>

<div class="cols">
  <div class="box">
    <h3>Стилистика</h3>
    <ul>
      <li>2D-моушн с элементами 3D: плитки дней, мягкие тени, глубина у карточек интерфейса.</li>
      <li>Интерфейс продукта показываем упрощённо, без лишних деталей.</li>
      <li>Курсор как элемент ролика: направляет взгляд, взаимодействует с интерфейсом, раскрывает следующие элементы.</li>
      <li>Лаконичные визуальные метафоры вместо иллюстративного сюжета.</li>
      <li>Ключевые фразы закадра дублируются кинетическим текстом.</li>
      <li>Вайб: вдохновляющий, спокойный, технологичный, без рекламного нажима.</li>
      <li>В конце ролика — логотип JustTalk.</li>
    </ul>
  </div>
  <div class="box">
    <h3>Палитра</h3>
    <div class="swatches">
      <div class="sw"><b style="background:#007AFF"></b>#007AFF</div>
      <div class="sw"><b style="background:#FFFFFF"></b>#FFFFFF</div>
      <div class="sw"><b style="background:#0A1F4D"></b>тёмно-синий</div>
    </div>
    <div class="lbl">Градиенты фонов с лендинга</div>
    <div class="grads">
      <div class="gsw"><b class="grad" style="--a:#B4D0F4;--b:#8FA6E6;--c:#2F9EE9;--d:#74C9F1;--e:#4A9FE4"></b>голубой</div>
      <div class="gsw"><b class="grad" style="--a:#EBC399;--b:#F2C39C;--c:#E3C08A;--d:#F4D4BF;--e:#EE9E68"></b>персиковый</div>
      <div class="gsw"><b class="grad" style="--a:#8DCDBF;--b:#97DCC9;--c:#85BAB3;--d:#CDEEDD;--e:#69C6BD"></b>мятный</div>
      <div class="gsw"><b class="grad" style="--a:#D06F9B;--b:#71B1D8;--c:#61A3D6;--d:#6E9CBD;--e:#7A6FB6"></b>розово-синий</div>
    </div>
    <p class="muted">Синий и белый — основа. В фонах мягкие градиенты с основного лендинга: голубой, персиковый, мятный и розово-синий.</p>
  </div>
</div>

<div class="box">
  <h3>Варианты сквозных элементов</h3>
  <p class="muted" style="font-size:13px">Стилистика примеров — условная.</p>
  <div class="cols els">
    <div><div class="lbl">Эквалайзер из логотипа</div><p>Может стать частью ролика или переходов между сценами: реагирует на закадровый голос, меняется вместе с ним и подчёркивает отдельные акценты.</p><div class="demo eq-demo" aria-hidden="true"><svg viewBox="0 0 240 80"></svg></div></div>
    <div><div class="lbl">Реальный коуч</div><p>Когда закадр говорит о преподавателе-человеке, возможно, стоит сделать вставку с реально отснятым коучем, например в окне звонка?</p><div class="demo coach-demo" aria-hidden="true"><div class="cw"><div class="cw-head"><i></i><i></i><i></i><span>Mock interview</span></div><div class="cw-tiles"><div class="cw-tile you"><span class="av">V</span><span class="nm">You</span></div><div class="cw-tile coach"><b class="grad video" style="--a:#B4D0F4;--b:#8FA6E6;--c:#2F9EE9;--d:#74C9F1;--e:#4A9FE4"></b><svg class="sil" viewBox="0 0 100 80"><path class="body" d="M10 80c0-22 18-34 40-34s40 12 40 34z"/><g class="head"><ellipse cx="50" cy="30" rx="15" ry="18"/></g></svg><span class="av">S</span><span class="live">LIVE</span><span class="nm">Coach <i class="talk"><b></b><b></b><b></b></i></span></div></div></div><svg class="cur pcur" viewBox="-1 -1 16 22"><path class="cur-face" d="M0 0V15l4-3.6 3 6.4 2.6-1.2-3-6.3H12z"/></svg></div></div>
    <div><div class="lbl">Счётчики</div><p>Можно сделать акцент на цифрах и визуализировать их. Например: 28 дней, 3 мока, 7 сессий с коучем, 22 дня практики, 3 звонка в день (66 за спринт), 3 месяца практики и так далее.</p><div class="demo stat-demo" aria-hidden="true"></div></div>
    <div class="wide"><div class="lbl">Календарь → плитки</div><p>Образ календаря и отдельных его элементов может стать визуализацией спринта: дней, этапов и движения по ним.</p><div class="cal-plates"><div class="demo cal-demo" aria-hidden="true"><span class="demo-tag">2D</span><svg viewBox="0 0 240 80"></svg></div><div class="demo cal3d-demo" aria-hidden="true"><span class="demo-tag">3D · плитки</span></div><div class="demo calbook-demo" aria-hidden="true"><span class="demo-tag">3D · перекидной календарь</span></div></div></div>
    <div><div class="lbl">Курсор</div><p>Курсор как элемент ролика: направляет взгляд, взаимодействует с интерфейсом, раскрывает следующие элементы.</p><div class="demo cur-demo" aria-hidden="true"><div class="stage-wrap"><div class="stage"><div class="ui"><div class="ui-head"><b>Today</b><span class="ui-prog"><i></i><i></i><i></i></span></div><div class="ui-row r1"><span class="av"></span><span class="tx"><b>Proudest Work</b><small>Done</small></span><span class="chk">✓</span></div><div class="ui-row r2"><span class="av"></span><span class="tx"><b>Your first 90 days</b><small>AI practice call</small></span><span class="go">Start</span></div></div><div class="pop"><small>FOCUS · PROOF POINT</small><span>Name the problem, your action and what changed.</span></div></div></div><span class="ring"></span><svg class="cur pcur" viewBox="-1 -1 16 22"><defs><linearGradient id="cur-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--brand) 55%,#fff)"/><stop offset=".55" style="stop-color:var(--brand)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--brand) 70%,#000)"/></linearGradient></defs><path class="cur-face" d="M0 0V15l4-3.6 3 6.4 2.6-1.2-3-6.3H12z"/></svg></div></div>
    <div><div class="lbl">Кинетический текст</div><p>Ключевые фразы закадра дублируются текстом на экране: слова появляются в ритм голоса, акценты выделяются цветом и размером, лишнее зачёркивается.</p><div class="demo kt-demo" aria-hidden="true"><div class="kt"></div><div class="kt"></div></div></div>
    <div><div class="lbl">Человек и его тень (опыт)</div><p>Силуэт человека в стилистике будущего ролика. Тень — её настоящий опыт. Иллюстрирует, как уровень английского дорастает до реального опыта.</p><div class="demo shadow-demo" aria-hidden="true"><svg viewBox="0 0 240 110"></svg></div></div>
  </div>
</div>

<div class="cols">
  <div class="box">
    <h3>Пэкшот</h3>
    <p>На <span class="hl">«Just talk»</span> эквалайзер собирается в логотип JustTalk синхронно с голосом. После, без голоса: <span class="hl">«The 28-day Interview Sprint»</span>, плашка <span class="hl">«Start with a $99 Audit»</span>, адрес interview.justtalk.ai.</p>
  </div>
  <div class="box">
    <h3>Вопросы</h3>
    <ul>
      <li>Если упоминаем коуча, называем его Шейн или делаем абстрактного?</li>
    </ul>
  </div>
</div>
`;

const BOARDS_INTRO = `
<div class="intro">
  <p>Ориентируемся на хронометраж около 40 секунд. Поэтому рассказываем только о ключевых моментах и делаем акценты на них: задача — передать основную идею, не погружаясь глубоко и не показывая детально все моменты взаимодействия с интерфейсом.</p>
  <p>Ключевые моменты, на которых делаем акцент:</p>
  <ul>
    <li><b>Проблема.</b> Человек силён в своей работе, но на английском его ответы звучат мельче, чем его опыт.</li>
    <li><b>Решение.</b> Interview Sprint: 28 дней подготовки к собеседованию.</li>
    <li><b>Живой коуч.</b> Пробное интервью с настоящим человеком, после которого остаётся один понятный фокус.</li>
    <li><b>Практика с ИИ.</b> Короткие ежедневные звонки с ИИ-интервьюером: вопросы, уточнения, обратная связь.</li>
    <li><b>Результат.</b> К концу спринта человек звучит как он сам, без заготовок и зубрёжки. Финал — «Just talk».</li>
  </ul>
  <p>Чтобы было понятно, как это ложится голосом по таймингу, ниже два условных примера начитки с фоновой музыкой.</p>
</div>
<div class="cols">
  <div class="box"><div class="lbl">Пример начитки 1</div><audio controls preload="metadata" src="audio/justtalk-sound-1.mp3"></audio></div>
  <div class="box"><div class="lbl">Пример начитки 2</div><audio controls preload="metadata" src="audio/justtalk-sound-2.mp3"></audio></div>
</div>
`;

const OUTRO = `
<div class="box">
  <h3>Необязательная вставка в любой вариант (+3 сек)</h3>
  <p class="vo">And when the real interview comes, you get a practice call built from the job ad.</p>
  <p class="ru">А перед настоящим собеседованием — тренировочный звонок по тексту вакансии.</p>
  <p class="note">Ставится перед «No scripts». Функция подтверждена на обновлённом лендинге и отвечает на вопрос «а что после 28 дней».</p>
</div>
`;
