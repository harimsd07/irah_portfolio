document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbar();
  initHamburger();
  initTypewriter();
  initProjectFilter();
  initSkillsObserver();
  initContactForm();
});

/* ─── CUSTOM CURSOR ─── */
function initCustomCursor() {
  // Don't show cursor on touch devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  const outer = document.getElementById('custom-cursor-outer');
  const t1 = document.getElementById('custom-cursor-trail-1');
  const t2 = document.getElementById('custom-cursor-trail-2');

  if (!outer || !t1 || !t2) return;

  outer.style.display = 'block';
  t1.style.display = 'block';
  t2.style.display = 'block';

  let mx = 0, my = 0;
  let ox = 0, oy = 0;
  let t1x = 0, t1y = 0;
  let t2x = 0, t2y = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    
    t1x += (ox - t1x) * 0.12;
    t1y += (oy - t1y) * 0.12;

    t2x += (t1x - t2x) * 0.1;
    t2y += (t1y - t2y) * 0.1;

    outer.style.left = ox + 'px';
    outer.style.top = oy + 'px';
    
    t1.style.left = t1x + 'px';
    t1.style.top = t1y + 'px';
    
    t2.style.left = t2x + 'px';
    t2.style.top = t2y + 'px';

    requestAnimationFrame(animate);
  }
  animate();

  // Swell on hoverable elements
  document.querySelectorAll('a, button, .btn, input, select, textarea, .project-card, .service-card, .skill-grid-card, .cert-card, .timeline-content').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outer.style.width = '48px';
      outer.style.height = '48px';
      outer.style.backgroundColor = 'rgba(255, 75, 145, 0.4)';
    });
    el.addEventListener('mouseleave', () => {
      outer.style.width = '32px';
      outer.style.height = '32px';
      outer.style.backgroundColor = 'rgba(255, 75, 145, 0.3)';
    });
  });
}

/* ─── NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    // Sticky layout styling
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Section highlighting
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ─── MOBILE HAMBURGER MENU ─── */
function initHamburger() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const spans = hamburger.querySelectorAll('span');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking nav links
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* ─── TYPEWRITER ANIMATION ─── */
function initTypewriter() {
  const words = ['Full Stack Developer', 'AI/LLM Developer', 'Flutter Developer', 'Arch Linux User (btw)', 'Freelancer'];
  let wordIdx = 0, charIdx = 0, isDeleting = false;
  const target = document.getElementById('typewriter');

  if (!target) return;

  function type() {
    const currentWord = words[wordIdx];
    if (!isDeleting) {
      target.textContent = currentWord.slice(0, ++charIdx);
      if (charIdx === currentWord.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      target.textContent = currentWord.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
}

/* ─── PROJECT FILTERING ─── */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const categories = card.dataset.cat || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ─── SKILLS INTERSECTION OBSERVER ─── */
function initSkillsObserver() {
  const barsContainer = document.getElementById('skillBars');
  const fills = document.querySelectorAll('.skill-bar-fill');

  if (!barsContainer) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(barsContainer);
}

/* ─── CONTACT FORM HANDLER ─── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');

  // Realtime validation triggers
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const msg = input.parentNode.querySelector('.error-msg');
        if (msg) msg.remove();
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate form submit
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting project proposal...';

    setTimeout(() => {
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;

      showModal(
        'Message Received! 🎉',
        `<p>Thank you for reaching out, <strong>${name}</strong>!</p>
         <p style="margin-top:10px;">I have received your request and will review the scope criteria details carefully. A response will be dispatched to <strong>${email}</strong> within 24 hours.</p>`
      );

      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }, 1200);
  });
}

function validateField(field) {
  // Clear error first
  const existing = field.parentNode.querySelector('.error-msg');
  if (existing) existing.remove();
  field.classList.remove('error');

  const isRequired = field.hasAttribute('required');
  const value = field.value.trim();

  if (isRequired && !value) {
    field.classList.add('error');
    addErrorMsg(field, 'This field is required.');
    return false;
  }

  if (field.type === 'email' && value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      field.classList.add('error');
      addErrorMsg(field, 'Please enter a valid email address.');
      return false;
    }
  }

  return true;
}

function addErrorMsg(field, text) {
  const msg = document.createElement('span');
  msg.className = 'error-msg';
  msg.textContent = text;
  field.parentNode.appendChild(msg);
}

/* ─── MODAL DIALOGS ─── */
function showModal(title, htmlContent) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" id="modalCloseBtn">&times;</button>
      <h3 class="modal-title">${title}</h3>
      <div class="modal-body">${htmlContent}</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#modalCloseBtn');
  const closeModalFn = () => {
    overlay.style.animation = 'modalFadeOut 0.25s ease-out forwards';
    overlay.querySelector('.modal').style.animation = 'modalSlideOut 0.25s ease-out forwards';
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 250);
  };

  closeBtn.addEventListener('click', closeModalFn);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModalFn();
  });
}
