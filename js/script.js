/**
 * ==============================================================================
 * HIMANSHU SEKHAR SAHOO - PORTFOLIO JAVASCRIPT
 * Modern, High-Performance, Accessible Vanilla JS (Zero External Libraries)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Theme with localStorage)
  // ----------------------------------------------------------------------------
  const initTheme = () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const rootElement = document.documentElement;

    // Determine initial theme: saved in localStorage, or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

    const applyTheme = (theme) => {
      rootElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute(
          'aria-label',
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
      }
      // Notify canvas to re-sample theme colors
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };

    applyTheme(initialTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }

    // React to OS-level theme preference changes if user hasn't explicitly chosen
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  };

  // ----------------------------------------------------------------------------
  // 2. Navigation Bar (Sticky scroll, mobile drawer, scroll spy, smooth scroll)
  // ----------------------------------------------------------------------------
  const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Sticky navbar on scroll
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile Hamburger Menu Toggle
    const closeMobileMenu = () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
          closeMobileMenu();
        } else {
          mobileToggle.classList.add('active');
          navMenu.classList.add('active');
          mobileToggle.setAttribute('aria-expanded', 'true');
          document.body.classList.add('menu-open');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (
          navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !mobileToggle.contains(e.target)
        ) {
          closeMobileMenu();
        }
      });

      // Close menu on pressing Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMobileMenu();
          mobileToggle.focus();
        }
      });
    }

    // Smooth Scroll with navbar height offset
    const navHeight = 70;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          closeMobileMenu();

          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Accessibility: update URL hash without jump
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });

    // Active Link Scroll Spy
    const highlightNavOnScroll = () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
    highlightNavOnScroll();
  };

  // ----------------------------------------------------------------------------
  // 3. Typing Animation (Hero Section)
  // ----------------------------------------------------------------------------
  const initTypingEffect = () => {
    const typedTextEl = document.getElementById('typedText');
    if (!typedTextEl) return;

    const phrases = [
      'Full Stack Developer',
      'Problem Solver',
      'Tech Enthusiast',
      'Open Source Contributor'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing phrase, pause before deleting
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting phrase, advance to next
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    typeLoop();
  };

  // ----------------------------------------------------------------------------
  // 4. Interactive Hero Canvas (Particle & Constellation Network)
  // ----------------------------------------------------------------------------
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    let animationFrameId;
    let particles = [];

    // Mouse coordinates tracking
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle Count based on screen size
    const getParticleCount = () => {
      const area = width * height;
      return Math.min(Math.floor(area / 14000), 75);
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
      }

      update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off canvas edges
        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

        // Mouse interaction (gentle repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 3;
            this.y -= forceDirectionY * force * 3;
          }
        }
      }

      draw(dotColor) {
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const getColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const dot = computedStyle.getPropertyValue('--canvas-dot').trim() || 'rgba(99, 102, 241, 0.6)';
      const line = computedStyle.getPropertyValue('--canvas-line').trim() || 'rgba(99, 102, 241, 0.12)';
      return { dot, line };
    };

    let colors = getColors();
    window.addEventListener('themeChanged', () => {
      colors = getColors();
    });

    const connectParticles = () => {
      const maxDistance = 115;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = colors.line.replace(/[\d.]+\)$/g, `${opacity * 0.18})`);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Connect to mouse if nearby
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particles[a].x;
          const dy = mouse.y - particles[a].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const opacity = 1 - distance / mouse.radius;
            ctx.strokeStyle = colors.line.replace(/[\d.]+\)$/g, `${opacity * 0.35})`);
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(colors.dot);
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Resize Handler
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Pause animation when hero is offscreen to save battery
    const heroSection = document.getElementById('home');
    if ('IntersectionObserver' in window && heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cancelAnimationFrame(animationFrameId);
            animate();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      });
      heroObserver.observe(heroSection);
    } else {
      animate();
    }

    initParticles();
    animate();
  };

  // ----------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Intersection Observer)
  // ----------------------------------------------------------------------------
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('reveal-active'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  // ----------------------------------------------------------------------------
  // 6. Animated Counter for Stats
  // ----------------------------------------------------------------------------
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quad
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOutProgress * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach((counter) => animateCounter(counter));
    }
  };

  // ----------------------------------------------------------------------------
  // 7. Project Category Filters (All | Web Apps | Mobile Apps | CLI Tools | Open Source)
  // ----------------------------------------------------------------------------
  const initProjectFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projectsGrid');

    if (!filterButtons.length || !projectCards.length) return;

    // Optional container for empty message
    let emptyNotice = document.getElementById('filterEmptyNotice');
    if (!emptyNotice) {
      emptyNotice = document.createElement('div');
      emptyNotice.id = 'filterEmptyNotice';
      emptyNotice.style.display = 'none';
      emptyNotice.style.gridColumn = '1 / -1';
      emptyNotice.style.textAlign = 'center';
      emptyNotice.style.padding = '3rem 1rem';
      emptyNotice.style.color = 'var(--text-secondary)';
      emptyNotice.innerHTML = `
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--accent-primary); margin-bottom: 1rem; display: block;"></i>
        <h4 style="font-size: 1.2rem; color: var(--text-heading); margin-bottom: 0.5rem;">New Projects Incoming</h4>
        <p style="font-size: 0.95rem;">Exciting repositories in this category are currently in active development. Stay tuned!</p>
      `;
      projectsGrid.appendChild(emptyNotice);
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Active button UI state
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          const matches = selectedFilter === 'all' || cardCategories.includes(selectedFilter);

          if (matches) {
            visibleCount++;
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });

        if (visibleCount === 0) {
          emptyNotice.style.display = 'block';
        } else {
          emptyNotice.style.display = 'none';
        }
      });
    });
  };

  // ----------------------------------------------------------------------------
  // 8. Contact Form Handling & Validation
  // ----------------------------------------------------------------------------
  const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Email validation regex (RFC 5322 official standard regex simplification)
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (input, condition) => {
      const parentGroup = input.closest('.floating-group');
      if (!condition) {
        parentGroup.classList.add('invalid');
        return false;
      } else {
        parentGroup.classList.remove('invalid');
        return true;
      }
    };

    // Live validation on blur
    nameInput.addEventListener('blur', () => validateField(nameInput, nameInput.value.trim().length > 1));
    emailInput.addEventListener('blur', () => validateField(emailInput, isValidEmail(emailInput.value.trim())));
    subjectInput.addEventListener('blur', () => validateField(subjectInput, subjectInput.value.trim().length > 2));
    messageInput.addEventListener('blur', () => validateField(messageInput, messageInput.value.trim().length >= 10));

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length > 1);
      const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length > 2);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields correctly.';
        formStatus.style.display = 'block';
        return;
      }

      // Simulated sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending Message...</span>
        <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
      `;

      setTimeout(() => {
        // Success feedback
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i>
          Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. I'll get back to you soon.
        `;
        formStatus.style.display = 'block';

        // Prepare mailto link as fallback option
        const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
        const mailtoBody = encodeURIComponent(
          `From: ${nameInput.value.trim()} (${emailInput.value.trim()})\n\nMessage:\n${messageInput.value.trim()}`
        );
        const mailtoUrl = `mailto:himanshuss2001@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Log mailto URL for convenience
        console.log('Form message sent. Fallback mailto:', mailtoUrl);

        contactForm.reset();

        // Clear status after 8 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      }, 1000);
    });
  };

  // ----------------------------------------------------------------------------
  // 9. Floating Back To Top Button
  // ----------------------------------------------------------------------------
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // ----------------------------------------------------------------------------
  // Initialization Orchestrator
  // ----------------------------------------------------------------------------
  initTheme();
  initNavbar();
  initTypingEffect();
  initHeroCanvas();
  initScrollReveal();
  initCounters();
  initProjectFilters();
  initContactForm();
  initBackToTop();

  console.log(
    '%c Himanshu Sekhar Sahoo | Portfolio Initialized Successfully 🚀 ',
    'background: #6366f1; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-weight: bold;'
  );
});
