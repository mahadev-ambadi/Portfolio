document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Background (Canvas)
  initParticles();

  // 2. Active Link Highlighting
  highlightActiveNavLink();

  // 3. Navigation Header Scroll Effect
  initHeaderScroll();

  // 4. Mobile Menu Toggle
  initMobileMenu();

  // 5. Interactive Glass Cards Glow (CSS variables)
  initCardGlow();

  // 6. Typwriter Effect (Only on index.html if target exists)
  initTypewriter();

  // 7. Project Card Filter (Only on projects.html if target exists)
  initProjectFilters();

  // 8. Contact Form Interaction (Only on contact.html if target exists)
  initContactForm();
});

/* ==========================================================================
   1. PARTICLES BACKGROUND
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let animationFrameId;

  // Particle Settings
  const settings = {
    particleCount: window.innerWidth < 768 ? 40 : 80,
    connectDistance: 120,
    particleColor: 'rgba(0, 242, 254, 0.25)',
    lineColor: 'rgba(0, 242, 254, 0.04)',
    maxSpeed: 0.8,
    minSpeed: 0.2
  };

  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    settings.particleCount = window.innerWidth < 768 ? 40 : 80;
  }
  
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // Track Mouse Move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Track Mouse Leave
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = settings.particleColor;
      ctx.fill();
    }

    update() {
      // Move particle
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive effect
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Push particles slightly away or attract
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }
  }

  // Create particles
  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < settings.particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }

  // Connect particles with lines
  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.hypot(dx, dy);

        if (distance < settings.connectDistance) {
          const opacity = (1 - distance / settings.connectDistance) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particlesArray[a].x - mouse.x;
        const dy = particlesArray[a].y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const opacity = (1 - distance / mouse.radius) * 0.2;
          ctx.strokeStyle = `rgba(161, 0, 254, ${opacity})`; // purple gradient connection to mouse
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connect();
    
    animationFrameId = requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* ==========================================================================
   2. NAV ACTIVE LINK
   ========================================================================== */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    // Normalize comparison for local files
    if (currentPath.endsWith(linkPath) || 
        (currentPath.endsWith('/') && linkPath === 'index.html') ||
        (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  function toggleScrolled() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', toggleScrolled);
  toggleScrolled();
}

/* ==========================================================================
   4. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    toggleBtn.innerHTML = isExpanded ? '<i class=\"bi bi-x-lg\"></i>' : '<i class=\"bi bi-list\"></i>';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      toggleBtn.innerHTML = '<i class=\"bi bi-list\"></i>';
    }
  });

  // Load Bootstrap Icons stylesheet dynamically if it is not present (for hamburgers and other icons)
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(link);
  }
}

/* ==========================================================================
   5. INTERACTIVE GLASS CARDS GLOW EFFECT
   ========================================================================== */
function initCardGlow() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   6. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const words = JSON.parse(target.getAttribute('data-words') || '[]');
  const prefixElement = document.getElementById('typed-prefix');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    // Update prefix dynamically based on vowel start
    if (prefixElement) {
      const firstChar = currentWord.charAt(0).toLowerCase();
      const needsAn = ['a', 'e', 'i', 'o', 'u'].includes(firstChar);
      prefixElement.textContent = needsAn ? 'an' : 'a';
    }

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 50; // Deleting is faster
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 120; // Typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = 1800; // Pause at the end of the word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300; // Pause before starting to type next word
    }

    setTimeout(type, delay);
  }

  if (words.length > 0) {
    setTimeout(type, 500);
  }
}


/* ==========================================================================
   7. PROJECT FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterContainer = document.querySelector('.portfolio-filters');
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card-container');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Force reflow and add entry animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Design a premium looking temporary dynamic glass toast notification
    showToastNotification(`Thanks, ${name}! Your message has been sent successfully.`);
    form.reset();
  });
}

function showToastNotification(message) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.padding = '1.25rem 2rem';
    toast.style.background = 'rgba(10, 11, 18, 0.9)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.border = '1px solid #00f2fe';
    toast.style.boxShadow = '0 10px 30px rgba(0, 242, 254, 0.2)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'var(--font-body)';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  
  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);

  // Hide toast after 4s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4000);
}
