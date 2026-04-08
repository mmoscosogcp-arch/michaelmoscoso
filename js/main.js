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
// FADE-UP ANIMATION on scroll
// ================================================
const fadeTargets = document.querySelectorAll(
  '.project-card, .skill-category, .roadmap-card, .badge, .timeline-item, .about-text p'
);

fadeTargets.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeTargets.forEach(el => observer.observe(el));

// ================================================
// STAGGER CHILDREN (grid items)
// ================================================
const staggerGroups = [
  '.skills-grid',
  '.projects-grid',
  '.roadmap-grid',
  '.about-badges',
];

staggerGroups.forEach(selector => {
  const container = document.querySelector(selector);
  if (!container) return;
  [...container.children].forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
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
