/* KeroProfile — shared language + reveal engine.
   Each page defines window.I18N = { en: {__title, ...}, ar: {...} }
   before this script. Default HTML content is English. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var STORE_KEY = 'kt-lang';

  function storedLang() {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved === 'en' || saved === 'ar') return saved;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('ar') === 0 ? 'ar' : 'en';
  }

  function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
  }

  function apply(lang) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* noop */ }

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        // Static, first-party strings only — safe by design.
        el.innerHTML = dict[key];
      } else if (window.console) {
        console.warn('[i18n] missing key "' + key + '" for "' + lang + '"');
      }
    }
    if (dict.__title) document.title = dict.__title;

    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'ar' ? 'English' : 'عربي';
  }

  function toggleLang() {
    apply(currentLang() === 'ar' ? 'en' : 'ar');
  }
  window.toggleLang = toggleLang; // used by inline onclick in nav

  // Apply as early as possible on DOM ready; head script already set lang/dir
  // so there is no layout flash before text swap.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      apply(storedLang());
    });
  } else {
    apply(storedLang());
  }

  // Reveal-on-scroll: one subtle fade-rise per section element.
  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* noop */ }
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
