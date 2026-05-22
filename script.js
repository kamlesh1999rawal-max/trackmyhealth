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

// ── BMI Calculator ──
function calculateBMI() {
  const height = parseFloat(document.getElementById('bmi-height').value);
  const weight = parseFloat(document.getElementById('bmi-weight').value);
  if (!height || !weight || height < 50 || weight < 10) return;

  const bmi = weight / Math.pow(height / 100, 2);
  const rounded = Math.round(bmi * 10) / 10;

  let category, color, tip;
  if (bmi < 18.5) {
    category = 'Underweight'; color = '#378ADD';
    tip = 'You are below a healthy weight range. Focus on nutrient-rich foods and strength training to build a healthy body.';
  } else if (bmi < 25) {
    category = 'Normal weight'; color = '#1D9E75';
    tip = 'Great! You are in a healthy weight range. Keep maintaining your balanced diet and active lifestyle.';
  } else if (bmi < 30) {
    category = 'Overweight'; color = '#F5A623';
    tip = 'You are slightly above the healthy range. A modest calorie deficit and regular cardio can help you reach a healthy weight.';
  } else {
    category = 'Obese'; color = '#D85A30';
    tip = 'Your BMI indicates obesity. We recommend consulting a healthcare provider for a safe, personalized weight loss plan.';
  }

  document.getElementById('bmi-score').textContent = rounded;
  document.getElementById('bmi-score').style.color = color;
  document.getElementById('bmi-category').textContent = category;
  document.getElementById('bmi-category').style.color = color;
  document.getElementById('bmi-tip').textContent = tip;
  document.getElementById('bmi-indicator').style.left = Math.min(Math.max(((bmi - 10) / 30) * 100, 2), 98) + '%';
  document.getElementById('bmi-indicator').style.background = color;

  document.getElementById('bmi-placeholder').style.display = 'none';
  document.getElementById('bmi-result').style.display = 'block';
}

// ── Calorie Calculator (Harris-Benedict) ──
function calculateCalories() {
  const gender = document.getElementById('cal-gender').value;
  const age = parseFloat(document.getElementById('cal-age').value);
  const height = parseFloat(document.getElementById('cal-height').value);
  const weight = parseFloat(document.getElementById('cal-weight').value);
  const activity = parseFloat(document.getElementById('cal-activity').value);
  if (!age || !height || !weight) return;

  const bmr = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  const maintain = Math.round(bmr * activity);
  const loseWeight = Math.round(maintain - 500);

  document.getElementById('cal-bmr').textContent = Math.round(bmr).toLocaleString() + ' kcal';
  document.getElementById('cal-maintain').textContent = maintain.toLocaleString() + ' kcal';
  document.getElementById('cal-loss').textContent = loseWeight.toLocaleString() + ' kcal';
  document.getElementById('cal-tip').textContent = `To lose ~0.5 kg per week, eat ${loseWeight.toLocaleString()} calories/day. Combine with 30+ minutes of daily movement for best results.`;

  document.getElementById('cal-placeholder').style.display = 'none';
  document.getElementById('cal-result').style.display = 'block';
}

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

// Goal chip toggle
document.querySelectorAll('.goal-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// Form submit → open personalized dashboard
document.getElementById('onboarding-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name    = this.querySelector('input[name="name"]').value.trim();
  const age     = this.querySelector('input[name="age"]').value;
  const height  = parseFloat(this.querySelector('input[name="height"]').value);
  const weight  = parseFloat(this.querySelector('input[name="weight"]').value);
  const goals   = [...this.querySelectorAll('input[name="goals"]:checked')].map(i => i.value);

  // BMI
  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  let bmiCat, bmiColor;
  if      (bmi < 18.5) { bmiCat = 'Underweight'; bmiColor = '#378ADD'; }
  else if (bmi < 25)   { bmiCat = 'Normal';       bmiColor = '#1D9E75'; }
  else if (bmi < 30)   { bmiCat = 'Overweight';   bmiColor = '#F5A623'; }
  else                 { bmiCat = 'Obese';         bmiColor = '#D85A30'; }

  // Avatar initials
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  // Populate dashboard fields
  document.getElementById('db-name').textContent     = name;
  document.getElementById('db-nav-name').textContent = name;
  document.getElementById('db-avatar').textContent   = initials;
  document.getElementById('db-age').textContent      = age + ' yrs';
  document.getElementById('db-height').textContent   = height + ' cm';
  document.getElementById('db-weight').textContent   = weight + ' kg';
  document.getElementById('db-bmi').textContent      = bmi;
  document.getElementById('db-bmi').style.color      = bmiColor;
  document.getElementById('db-bmi-cat').textContent  = bmiCat;
  document.getElementById('db-bmi-cat').style.color  = bmiColor;
  document.getElementById('db-date').textContent     = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Goals chips
  const goalLabels = {
    'lose-weight':    '🏃 Lose weight',
    'build-muscle':   '💪 Build muscle',
    'sleep-better':   '💤 Sleep better',
    'reduce-stress':  '🧘 Reduce stress',
    'improve-fitness':'⚡ Improve fitness',
    'track-nutrition':'🥗 Track nutrition'
  };
  document.getElementById('db-goals').innerHTML = goals.length
    ? goals.map(g => `<span class="db-goal-chip">${goalLabels[g]}</span>`).join('')
    : '<span class="db-goal-chip">🌟 General wellness</span>';

  // Personalised tips
  const tipMap = {
    'lose-weight':    { icon:'🏃', title:'Calorie deficit',    desc:'Eat 300–500 fewer calories than you burn each day. Combine with cardio 3–5× a week for steady, sustainable weight loss.' },
    'build-muscle':   { icon:'💪', title:'Strength training',  desc:'Lift weights 3–4× a week targeting each muscle group. Aim for 1.6–2.2 g of protein per kg of body weight.' },
    'sleep-better':   { icon:'😴', title:'Sleep hygiene',      desc:'Keep a consistent sleep schedule and avoid screens 1 hour before bed. Aim for 7–9 hours of quality rest.' },
    'reduce-stress':  { icon:'🧘', title:'Mindful moments',    desc:'Practice 10 minutes of meditation or deep breathing daily. Even short sessions significantly lower cortisol.' },
    'improve-fitness':{ icon:'⚡', title:'Cardio routine',     desc:'Aim for 150 minutes of moderate aerobic activity per week — mix running, cycling, or swimming for best results.' },
    'track-nutrition':{ icon:'🥗', title:'Balanced meals',     desc:'Build every meal with protein, complex carbs, and healthy fats. Tracking meals helps you spot nutritional gaps.' }
  };
  const defaults = [
    { icon:'💧', title:'Stay hydrated',   desc:'Drink at least 8 glasses of water daily. Hydration boosts energy, focus, and metabolism.' },
    { icon:'🚶', title:'10,000 steps/day',desc:'Walking is one of the most effective habits for overall health and sustainable calorie burn.' },
    { icon:'🌙', title:'Rest well',       desc:'Quality sleep regulates hunger hormones, speeds recovery, and sharpens your focus the next day.' }
  ];
  const tips = goals.length ? goals.slice(0, 6).map(g => tipMap[g]) : defaults;
  document.getElementById('db-tips').innerHTML = tips.map(t =>
    `<div class="feat-card">
       <div class="feat-icon-wrap">${t.icon}</div>
       <div class="feat-title">${t.title}</div>
       <div class="feat-desc">${t.desc}</div>
     </div>`
  ).join('');

  // Switch views
  closeModal();
  document.getElementById('main-page').style.display = 'none';
  document.getElementById('dashboard-page').style.display = 'block';
  window.scrollTo(0, 0);
});

function goBack() {
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('main-page').style.display = 'block';
  window.scrollTo(0, 0);
}