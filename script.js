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