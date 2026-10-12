const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const backTop = document.querySelector('.back-top');
const modal = document.querySelector('#demo-modal');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const originalTitle = modalTitle.textContent;
const originalDescription = modalDescription.textContent;
let lastTrigger;

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 1101px)').addEventListener('change', closeMenu);

// Native details remain usable without JavaScript; JS coordinates each accordion.
document.querySelectorAll('.accordion').forEach(accordion => {
  accordion.querySelectorAll('details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) accordion.querySelectorAll('details').forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });
});

function openDemo(trigger, social) {
  lastTrigger = trigger;
  modalTitle.textContent = social ? `${social}: canal demonstrativo` : originalTitle;
  modalDescription.textContent = social ? 'Esta rede social é apenas ilustrativa. A Nexa Academy é um projeto fictício de portfólio e não possui um perfil vinculado a este botão.' : originalDescription;
  modal.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-enroll]').forEach(button => button.addEventListener('click', () => openDemo(button)));
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => openDemo(button, button.dataset.demo)));
document.querySelectorAll('.modal-close, .modal-confirm').forEach(button => button.addEventListener('click', () => modal.close()));
modal.addEventListener('click', event => {
  const bounds = modal.getBoundingClientRect();
  if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
});
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lastTrigger?.focus();
});
modal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = modal.querySelectorAll('button, a[href], input, [tabindex="0"]');
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  backTop.hidden = window.scrollY < 600;
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .skill-card, .project, .instructor-grid, .price-card').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
