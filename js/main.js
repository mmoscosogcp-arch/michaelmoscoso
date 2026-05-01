// ================================================
// NAVBAR — scroll effect + mobile toggle
// ================================================
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ================================================
// ACTIVE NAV LINK on scroll
// ================================================
const sections = document.querySelectorAll('section[id]');

const activateLink = () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + height)
        ? 'var(--text)' : '';
    }
  });
};
window.addEventListener('scroll', activateLink);

// ================================================
// 1. SCROLL REVEAL — staggered spring
// ================================================
const revealEls = document.querySelectorAll(
  '.bento-card, .skill-category, .timeline-item, ' +
  '.section-title, .pcard-future, .contact-card, .feat-stat, .badge, .about-badges .badge'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--stagger', i % 8);
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.08 }
);
revealEls.forEach(el => revealObserver.observe(el));

// ================================================
// 2. TYPEWRITER en hero subtitle
// ================================================
const typeEl = document.querySelector('.hero-subtitle');
if (typeEl) {
  const words = [
    'Data Analyst → Data Engineer',
    'ETL · GCP · BigQuery · Airflow',
    'Pipelines reales. Datos reales.',
  ];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = words[wordIndex];
    typeEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let delay = deleting ? 40 : 70;
    if (!deleting && charIndex > current.length)   { delay = 2400; deleting = true; }
    else if (deleting && charIndex < 0)            { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
  }
  typeEl.textContent = '';
  setTimeout(type, 900);
}

// ================================================
// 3. NAVBAR PROGRESS BAR
// ================================================
const progressBar = document.createElement('div');
progressBar.className = 'nav-progress';
document.getElementById('navbar').appendChild(progressBar);

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

// ================================================
// 4. COUNTER ANIMATION — count up on scroll
// ================================================
function animateCounter(el) {
  const raw = el.textContent.trim();
  const numMatch = raw.match(/[\d.]+/);
  if (!numMatch) return;

  const target   = parseFloat(numMatch[0]);
  const prefix   = raw.slice(0, numMatch.index);
  const suffix   = raw.slice(numMatch.index + numMatch[0].length);
  const hasDecimal = numMatch[0].includes('.');
  const duration = 1500;
  const startTime = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value    = easeOutCubic(progress) * target;
    el.textContent = prefix +
      (hasDecimal ? value.toFixed(1) : Math.round(value).toLocaleString('es-CL')) +
      suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  el.textContent = prefix + '0' + suffix;
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.65 }
);
document.querySelectorAll('.bento-stat-num').forEach(el => counterObserver.observe(el));

// ================================================
// 5. 3D TILT + SPOTLIGHT on bento cards
// ================================================
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
  document.querySelectorAll('.bento-card').forEach(card => {
    const maxTilt = card.classList.contains('bento-hero') ? 3.5 : 6;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;

      // 3D tilt
      card.style.transform  = `perspective(900px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateZ(6px)`;
      card.style.transition = 'transform .06s linear';

      // Spotlight CSS vars
      card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, border-color .3s ease';
    });
  });
}

// ================================================
// SMOOTH SCROLL for anchor links
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ================================================
// CODE CARD — fade in on load
// ================================================
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
  const original  = codeBody.innerHTML;
  codeBody.innerHTML   = '';
  codeBody.style.opacity = '0';
  setTimeout(() => {
    codeBody.innerHTML = original;
    codeBody.style.transition = 'opacity .7s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => { codeBody.style.opacity = '1'; }));
  }, 500);
}

// ================================================
// FOOTER — year update
// ================================================
const footerYear = document.querySelector('.footer p');
if (footerYear) {
  footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, new Date().getFullYear());
}

// ================================================
// EL KITTY MODAL
// ================================================
const kittyTrigger = document.getElementById('kitty-trigger');
const kittyModal   = document.getElementById('kitty-modal');
const kittyClose   = document.getElementById('kitty-close');

const quotes = [
  '"Miau." — El Kitty, filósofo.',
  '"Zzzz..." — El Kitty, durmiendo la siesta.',
  '"¿Me diste atún? No. Entonces no me hables." — El Kitty.',
  '"El mundo gira para mí." — El Kitty, siempre.',
  '"Fui, vi, dormí." — El Kitty, 2013–2026.',
];

function openKittyModal() {
  document.querySelector('.kitty-modal-quote').textContent =
    quotes[Math.floor(Math.random() * quotes.length)];
  kittyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeKittyModal() {
  kittyModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (kittyTrigger) kittyTrigger.addEventListener('click', openKittyModal);
if (kittyClose)   kittyClose.addEventListener('click', closeKittyModal);
if (kittyModal) {
  kittyModal.addEventListener('click', e => { if (e.target === kittyModal) closeKittyModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeKittyModal(); });
}
