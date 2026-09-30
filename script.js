const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const loader = $('#loader');
    const loadBar = $('#loadBar');
    const loadPercent = $('#loadPercent');
    const loadLabel = $('#loadLabel');

    const loadingLabels = [
      'loading interface',
      'calibrating gold pixels',
      'warming up JavaScript',
      'summoning Pikachu',
      'building the experience',
      'almost there'
    ];

    let progress = 0;
    const loaderTick = setInterval(() => {
      progress += Math.random() * 11 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderTick);
        loadLabel.textContent = 'interface ready';
        loadBar.style.width = '100%';
        loadPercent.textContent = '100%';
        setTimeout(() => loader.classList.add('is-done'), 520);
      } else {
        loadBar.style.width = `${progress}%`;
        loadPercent.textContent = `${String(Math.floor(progress)).padStart(3, '0')}%`;
        loadLabel.textContent = loadingLabels[Math.min(loadingLabels.length - 1, Math.floor(progress / 18))];
      }
    }, 105);

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (progress < 100) progress = 100;
        loadBar.style.width = '100%';
        loadPercent.textContent = '100%';
        loadLabel.textContent = 'interface ready';
      }, 250);
    });

    const themeBtn = $('#themeBtn');
    const themeIcon = $('#themeIcon');
    const savedTheme = localStorage.getItem('krish-theme');

    function setTheme(theme) {
      document.body.classList.toggle('light', theme === 'light');
      localStorage.setItem('krish-theme', theme);
      themeIcon.innerHTML = theme === 'light'
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>'
        : '<path d="M20.8 15.1A8.5 8.5 0 1 1 8.9 3.2 6.6 6.6 0 0 0 20.8 15.1Z"/>';
    }

    setTheme(savedTheme || 'dark');
    themeBtn.addEventListener('click', () => {
      setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
    });

    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    const spotlight = $('#spotlight');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      spotlight.style.setProperty('--mx', `${mouseX}px`);
      spotlight.style.setProperty('--my', `${mouseY}px`);
      dot.style.transform = `translate3d(${mouseX - 3.5}px, ${mouseY - 3.5}px, 0)`;
      document.body.classList.add('cursor-ready');
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.17;
      ringY += (mouseY - ringY) * 0.17;
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    $$('a, button, .skill-card, .project').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '58px';
        ring.style.height = '58px';
        ring.style.margin = '-9px';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.margin = '0';
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 5, 4) * 75}ms`;
      observer.observe(el);
    });

    const sections = $$('main section[id]');
    const navLinks = $$('.rail-link[data-section]');
    const progressLine = $('#progressLine');

    function updateScrollUI() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? window.scrollY / total : 0;
      progressLine.style.setProperty('width', `${ratio * 100}%`);

      let current = sections[0]?.id || 'home';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.42) current = section.id;
      });

      navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === current));
    }

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    const tilt = $('#tiltCard');
    if (tilt && window.matchMedia('(pointer:fine)').matches) {
      tilt.addEventListener('mousemove', (e) => {
        const rect = tilt.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - .5) * 8;
        const rotateX = (.5 - py) * 8;
        tilt.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      tilt.addEventListener('mouseleave', () => {
        tilt.style.transform = '';
      });
    }
    $$('.project').forEach((project) => {
      const arrow = $('.project-arrow', project);
      if (!arrow || !window.matchMedia('(pointer:fine)').matches) return;
      project.addEventListener('mousemove', (e) => {
        const rect = project.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        arrow.style.transform = `translate(${x * 10}px, ${y * 10 - 4}px)`;
      });
      project.addEventListener('mouseleave', () => arrow.style.transform = '');
    });
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        themeBtn.click();
      }
    });

    /* ---------- Year ---------- */
    $('#year').textContent = new Date().getFullYear();