(function(){
  "use strict";

  /* ---------- появление по скроллу ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    rv.forEach(function(el){ io.observe(el); });
  } else {
    rv.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- тень шапки ---------- */
  var top = document.getElementById('top');
  var onScroll = function(){ top.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- переключатель языка ---------- */
  var nodes = document.querySelectorAll('[data-i18n]');
  var btns  = document.querySelectorAll('.lang button');
  /* Ссылок на резюме три: скромная на первом экране, карточка в контактах
     и кнопка в нижней панели. Собираем по атрибуту, а не по трём id —
     иначе четвёртую однажды забудут переключить вместе с языком. */
  var cvLinks = document.querySelectorAll('[data-cv]');

  function apply(lang){
    nodes.forEach(function(n){
      var v = n.getAttribute('data-' + lang);
      if (v !== null) n.innerHTML = v;
    });
    document.documentElement.lang = lang;
    document.title = lang === 'en'
      ? 'Ivan Kuznetsov — turning technology into revenue growth for clients'
      : 'Иван Кузнецов — превращаю технологии в рост выручки клиентов';
    /* download задаёт имя, под которым файл ляжет в «Загрузки». Без него
       у человека остаётся безликий cv-ru.pdf, и через неделю он уже не
       вспомнит, чьё это резюме. Меняется вместе с языком. */
    var file = lang === 'en' ? 'assets/cv-en.pdf' : 'assets/cv-ru.pdf';
    var name = lang === 'en' ? 'Ivan Kuznetsov — CV.pdf' : 'Иван Кузнецов — резюме.pdf';
    cvLinks.forEach(function(a){ a.href = file; a.setAttribute('download', name); });
    btns.forEach(function(b){
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('ik-lang', lang); } catch(e){}
  }

  btns.forEach(function(b){
    b.addEventListener('click', function(){ apply(b.getAttribute('data-lang')); });
  });

  /* По умолчанию — русский. Автоопределение по локали браузера намеренно
     не используется: значительная часть русскоязычной аудитории сидит на
     англоязычной системе и получила бы EN-версию против своего ожидания.
     Английский включается только явным выбором и запоминается.

     Исключение — язык, заданный прямо в ссылке: ikuz.me/?lang=en. Это
     тоже явный выбор, только сделанный отправителем. Он важнее
     сохранённого: человеку прислали английскую ссылку, и он должен
     увидеть английскую версию, даже если раньше открывал русскую. */
  var forced = null, saved = null;
  var m = /[?&]lang=(ru|en)(?:&|$)/.exec(location.search);
  if (m) forced = m[1];
  try { saved = localStorage.getItem('ik-lang'); } catch(e){}

  if (forced) apply(forced);
  else if (saved === 'en') apply('en');
})();
