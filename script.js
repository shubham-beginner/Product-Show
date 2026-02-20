 (function() {
      "use strict";

      // ---------- INTRO BUTTON & FADE ----------
      const enterBtn = document.getElementById('enter-btn');
      const intro = document.getElementById('intro');
      
      enterBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // avoid any weirdness
        enterBtn.classList.add('shine');

        setTimeout(() => {
          intro.style.transition = 'opacity 0.7s';
          intro.style.opacity = '0';
          setTimeout(() => {
            intro.style.display = 'none';
          }, 700);
        }, 800);
      });

      // ---------- YOUR CUSTOM VIDEOS ----------
const bgVideo = document.getElementById('bg-video');
const introImg = document.getElementById('intro-img');

function setCustomVideo() {
  const width = window.innerWidth;

  if (width < 768) {
    bgVideo.src = "Untitled design.mp4";
  } else {
    bgVideo.src = "barbie.mp4";
  }

  bgVideo.load();          // important for Safari
  bgVideo.play().catch(() => {});  // prevents autoplay error
}
  console.log('Video loaded for', width < 768 ? 'mobile' : 'desktop');
}
setCustomVideo();
window.addEventListener('resize', setCustomVideo);

      // ---------- PARTICLES ----------
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let width = window.innerWidth;
      let height = window.innerHeight;

      function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }
      window.addEventListener('resize', resizeCanvas);

      let particles = [];
      const PARTICLE_COUNT = 45;

      function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 0.4 + 0.1
          });
        }
      }
      initParticles();

      function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
        ctx.shadowColor = '#ffb6c1';
        ctx.shadowBlur = 8;
        for (let p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        }
        requestAnimationFrame(drawParticles);
      }
      drawParticles();

      // ---------- CUSTOM CURSOR (only on hover devices) ----------
      const cursor = document.querySelector('.cursor');
      // On touch devices we hide via CSS, but we still avoid mousemove spam
      if (window.matchMedia('(hover: hover)').matches) {
        // enable custom cursor
        document.addEventListener('mousemove', function(e) {
          cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
      } else {
        cursor.style.display = 'none';
      }

      // ---------- TRAIL (limited, only on hover) ----------
      let trails = [];
      const maxTrails = 12;
      if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', function(e) {
          if (trails.length >= maxTrails) {
            let oldest = trails.shift();
            if (oldest && oldest.parentNode) oldest.remove();
          }
          const trail = document.createElement('div');
          trail.className = 'trail';
          trail.style.left = e.clientX + 'px';
          trail.style.top = e.clientY + 'px';
          document.body.appendChild(trail);
          trails.push(trail);

          setTimeout(() => {
            if (trail.parentNode) trail.remove();
            trails = trails.filter(t => t !== trail);
          }, 200);
        });
      }

      // ---------- FLOATING HEARTS & STARS ----------
      const floating = document.getElementById('floating');
      let floatingCount = 0;
      const MAX_FLOATING = 25;

      function createFloating() {
        if (floatingCount >= MAX_FLOATING) return;
        const isHeart = Math.random() > 0.5;
        const el = document.createElement('div');
        el.className = isHeart ? 'heart' : 'star';
        el.style.left = (Math.random() * 90 + 5) + 'vw';
        el.style.animationDuration = (4 + Math.random() * 5) + 's';
        el.style.animationDelay = (Math.random() * 2) + 's';
        floating.appendChild(el);
        floatingCount++;

        setTimeout(() => {
          if (el.parentNode) {
            el.remove();
            floatingCount--;
          }
        }, 9000);
      }
      setInterval(() => {
        if (document.hidden) return;
        createFloating();
      }, 1200);

      // ---------- SCROLL REVEAL ----------
      const cards = document.querySelectorAll('.card');
      function revealCards() {
        const windowHeight = window.innerHeight;
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.top < windowHeight - 80 && rect.bottom > 20) {
            card.classList.add('revealed');
          }
          // once revealed stays revealed (no removal)
        });
      }
      window.addEventListener('scroll', revealCards, { passive: true });
      window.addEventListener('resize', revealCards);
      revealCards();

      // ensure all product links open safely
      document.querySelectorAll('.btn').forEach(btn => {
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener');
      });

      // ---------- FIX: cursor hidden but desktop now shows default? we override body cursor for hover devices? 
      // we want custom cursor only when hover, but default cursor hidden.
      if (window.matchMedia('(hover: hover)').matches) {
        document.body.style.cursor = 'none'; // hide default only on desktop
      } else {
        document.body.style.cursor = 'auto';
      }

      // But we also need to make sure that if custom cursor disappears, default appears. 
      // The media query in CSS hides .cursor on touch, and we set body cursor accordingly.
      // Also handle dynamic resize: 
      function handleDeviceChange() {
        if (window.matchMedia('(hover: hover)').matches) {
          document.body.style.cursor = 'none';
        } else {
          document.body.style.cursor = 'auto';
        }
      }
      window.matchMedia('(hover: hover)').addEventListener('change', handleDeviceChange);
      handleDeviceChange();


    })();


