(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const menu = document.getElementById('slide-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const previous = document.getElementById('previous-slide');
  const next = document.getElementById('next-slide');
  const select = document.getElementById('slide-select');
  const progress = document.getElementById('slide-progress');
  const stage = document.getElementById('deck-stage');
  const announcement = document.getElementById('slide-announcement');
  const sheetPrevious = document.getElementById('sheet-previous');
  const sheetNext = document.getElementById('sheet-next');
  const desktopPointer = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
  const interactive = 'a, button, input, textarea, select, summary, label, details, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"])';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  const legacy = {platform: 3, route: 5, approach: 4};
  const indexFromHash = () => {
    const match = location.hash.match(/^#slide-(\d{2})$/);
    const number = match ? Number(match[1]) : legacy[location.hash.slice(1)];
    return number >= 1 && number <= slides.length ? number - 1 : 0;
  };
  function closeMenu() { menu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
  function show(index, {updateHash = true, focusHeading = false} = {}) {
    if (index < 0 || index >= slides.length) return;
    const focusedInSlide = slides[current].contains(document.activeElement);
    current = index;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    const active = slides[index];
    active.scrollTop = 0;
    active.classList.remove('is-entering');
    if (!reducedMotion.matches) { void active.offsetWidth; active.classList.add('is-entering'); }
    menu.querySelectorAll('[data-slide]').forEach(button => {
      if (Number(button.dataset.slide) === index + 1) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    sheetPrevious.disabled = index === 0;
    sheetNext.disabled = index === slides.length - 1;
    delete stage.dataset.turn;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    select.value = String(index + 1);
    progress.setAttribute('aria-valuenow', String(index + 1));
    progress.firstElementChild.style.width = ((index + 1) / slides.length * 100) + '%';
    stage.classList.toggle('is-first', index === 0);
    stage.classList.toggle('is-last', index === slides.length - 1);
    if (updateHash) history.replaceState(null, '', '#slide-' + String(index + 1).padStart(2, '0'));
    announcement.textContent = active.getAttribute('aria-label');
    document.title = select.selectedOptions[0].textContent.split(' · ')[1] + ' — Unicorn Consultancy Sàrl';
    closeMenu();
    if (window.matchMedia('(max-width: 700px)').matches && window.scrollY > 80) {
      const top = stage.getBoundingClientRect().top + window.scrollY - document.querySelector('.presentation-header').offsetHeight - 16;
      window.scrollTo({top: Math.max(0, top), behavior: 'instant'});
    }
    if (focusHeading || focusedInSlide) active.querySelector('h1').focus({preventScroll: true});
  }
  document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.slide) - 1, {focusHeading: true})));
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  // Glass zones are visual/keyboard controls; pointer events pass through to the sheet.
  // Delegation leaves links, form controls, disclosure panels and text selection intact.
  sheetPrevious.addEventListener('click', () => show(current - 1));
  sheetNext.addEventListener('click', () => show(current + 1));
  function directionAt(event) {
    if (!desktopPointer.matches || event.pointerType === 'touch' || event.target.closest(interactive)) return 0;
    const sheet = event.target.closest('.slide');
    if (!sheet || sheet.hidden) return 0;
    const box = sheet.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) return 0;
    const direction = event.clientX < box.left + box.width / 2 ? -1 : 1;
    if (current + direction < 0 || current + direction >= slides.length) return 0;
    return direction;
  }
  stage.addEventListener('pointermove', event => {
    const direction = directionAt(event);
    if (direction) stage.dataset.turn = direction < 0 ? 'previous' : 'next';
    else delete stage.dataset.turn;
  });
  stage.addEventListener('pointerleave', () => { delete stage.dataset.turn; });
  desktopPointer.addEventListener('change', () => { delete stage.dataset.turn; });
  let sheetPress;
  stage.addEventListener('pointerdown', event => {
    sheetPress = event.button === 0 && event.pointerType !== 'touch' ? {x:event.clientX, y:event.clientY, selecting:!window.getSelection().isCollapsed} : null;
  });
  stage.addEventListener('pointercancel', () => { sheetPress = null; });
  stage.addEventListener('click', event => {
    const press = sheetPress;
    sheetPress = null;
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!press || press.selecting || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6 || !window.getSelection().isCollapsed) return;
    const direction = directionAt(event);
    if (direction) show(current + direction);
  });
  select.addEventListener('change', () => show(Number(select.value) - 1));
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); menuToggle.focus(); return; }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && !event.target.closest('a, button, select, summary')) touchStart = {x:event.clientX, y:event.clientY, id:event.pointerId};
  });
  stage.addEventListener('pointerup', event => {
    if (!touchStart || event.pointerId !== touchStart.id) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });
  window.addEventListener('hashchange', () => show(indexFromHash(), {updateHash:false}));
  show(indexFromHash(), {updateHash:false});
})();
