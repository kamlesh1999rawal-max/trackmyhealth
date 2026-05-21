// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feat-card, .testi-card, .habit-item, .sm-metric').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Button ripple effect
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute; width: 6px; height: 6px;
      background: rgba(255,255,255,0.5); border-radius: 50%;
      left: ${e.clientX - rect.left}px; top: ${e.clientY - rect.top}px;
      transform: scale(0); animation: ripple 0.5s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(30); opacity: 0; } }`;
document.head.appendChild(style);

// Habit item click to toggle done/pending
document.querySelectorAll('.habit-item').forEach(item => {
  item.addEventListener('click', () => {
    const check = item.querySelector('.habit-check');
    if (check.classList.contains('pending')) {
      check.classList.replace('pending', 'done');
      check.textContent = '✓';
    } else {
      check.classList.replace('done', 'pending');
      check.textContent = '○';
    }
  });
});

// Nav shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(127,119,221,0.1)'
    : 'none';
});

// ── Onboarding Modal ──
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('onboarding-form').style.display = '';
    document.getElementById('modal-header').style.display = '';
    document.getElementById('modal-success').classList.remove('show');
    document.getElementById('onboarding-form').reset();
    document.querySelectorAll('.goal-chip').forEach(c => c.classList.remove('selected'));
  }, 300);
}

// Open on any primary CTA outside the modal
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('click', function() {
    if (!this.closest('.modal-card')) openModal();
  });
});

// Close on backdrop click or close button
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('success-close').addEventListener('click', closeModal);

// Goal chip toggle
document.querySelectorAll('.goal-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// Form submit → success screen
document.getElementById('onboarding-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.querySelector('input[name="name"]').value.trim();
  document.getElementById('success-name').textContent = name || 'there';
  this.style.display = 'none';
  document.getElementById('modal-header').style.display = 'none';
  document.getElementById('modal-success').classList.add('show');
});