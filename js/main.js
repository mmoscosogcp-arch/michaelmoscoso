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

// Close mobile menu on link click
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
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--text)';
      } else {
        link.style.color = '';
      }
    }
  });
};

window.addEventListener('scroll', activateLink);

// ================================================
// 1. SCROLL REVEAL
// ================================================
const revealEls = document.querySelectorAll(
  '.bento-card, .skill-category, .timeline-item, .about-badge, ' +
  '.section-title, .pcard-future, .contact-card, .feat-stat'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ================================================
// 2. TYPEWRITER en hero subtitle
// ================================================
const typeEl = document.querySelector('.hero-subtitle');
if (typeEl) {
  const words = ['Data Analyst → Data Engineer', 'ETL · GCP · BigQuery · Airflow', 'Pipelines reales. Datos reales.'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = words[wordIndex];
    if (deleting) {
      typeEl.textContent = current.substring(0, charIndex--);
    } else {
      typeEl.textContent = current.substring(0, charIndex++);
    }

    let delay = deleting ? 40 : 70;

    if (!deleting && charIndex > current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  typeEl.textContent = '';
  setTimeout(type, 800);
}

// ================================================
// 3. NAVBAR PROGRESS BAR
// ================================================
const progressBar = document.createElement('div');
progressBar.className = 'nav-progress';
document.getElementById('navbar').appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
});

// ================================================
// 4. CURSOR PERSONALIZADO
// ================================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'custom-cursor-dot';
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// cursor ring sigue con lag suave
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// agrandar en hover sobre links y botones
document.querySelectorAll('a, button, .bento-card, .kitty-img').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// ================================================
// SMOOTH SCROLL for anchor links
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ================================================
// CODE CARD — typing animation
// ================================================
const codeBody = document.querySelector('.code-body code');
if (codeBody) {
  const original = codeBody.innerHTML;
  codeBody.innerHTML = '';
  let i = 0;

  // strip tags to get plain text length, then replay
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = original;
  const plainText = tempDiv.textContent;

  // Simple reveal: just fade in the whole block after short delay
  setTimeout(() => {
    codeBody.style.opacity = '0';
    codeBody.innerHTML = original;
    codeBody.style.transition = 'opacity .6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { codeBody.style.opacity = '1'; });
    });
  }, 400);
}

// ================================================
// HERO — year update in footer
// ================================================
const footerYear = document.querySelector('.footer p');
if (footerYear) {
  const currentYear = new Date().getFullYear();
  footerYear.innerHTML = footerYear.innerHTML.replace('2026', currentYear);
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
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector('.kitty-modal-quote').textContent = quote;
  kittyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeKittyModal() {
  kittyModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (kittyTrigger) {
  kittyTrigger.addEventListener('click', openKittyModal);
}
if (kittyClose) {
  kittyClose.addEventListener('click', closeKittyModal);
}
if (kittyModal) {
  kittyModal.addEventListener('click', (e) => {
    if (e.target === kittyModal) closeKittyModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeKittyModal();
  });
}
