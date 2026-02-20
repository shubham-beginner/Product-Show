(function() {
  "use strict";

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', function() {
    
    // ---------- INTRO BUTTON & FADE ----------
    const enterBtn = document.getElementById('enter-btn');
    const intro = document.getElementById('intro');
    
    if (enterBtn && intro) {
      enterBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        enterBtn.classList.add('shine');

        setTimeout(() => {
          intro.style.transition = 'opacity 0.7s ease';
          intro.style.opacity = '0';
          setTimeout(() => {
            intro.style.display = 'none';
          }, 700);
        }, 800);
      });
    }

    // ---------- CUSTOM VIDEOS ----------
    const bgVideo = document.getElementById('bg-video');
    
    function setCustomVideo() {
      if (!bgVideo) return;
      
      const width = window.innerWidth;
      const isMobile = width < 768;
      
      // Set video source based on device
      if (isMobile) {
        bgVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-pink-and-purple-abstract-background-11907-large.mp4";
      } else {
        bgVideo.src = "https://assets.mixkit.co/videos/preview/mixkit-pastel-colorful-gradient-11905-large.mp4";
      }

      bgVideo.load();
      
      // Try to play with error handling
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          // Add play button if autoplay fails
        });
      }
      
      console.log('Video loaded for', isMobile ? 'mobile' : 'desktop');
    }
    
    setCustomVideo();
    
    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCustomVideo, 250);
    });

    // ---------- PARTICLES ----------
    const canvas = document.getElementById('particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      const PARTICLE_COUNT = 45;

      function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }

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

      function drawParticles() {
        if (!ctx) return;
        
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

      // Initialize particles
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      drawParticles();
    }

    // ---------- CUSTOM CURSOR ----------
    const cursor = document.querySelector('.cursor');
    
    if (cursor && window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mousemove', function(e) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursor.style.left = '0';
        cursor.style.top = '0';
      });
    } else if (cursor) {
      cursor.style.display = 'none';
    }

    // ---------- TRAIL EFFECT ----------
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
      if (!floating || floatingCount >= MAX_FLOATING || document.hidden) return;
      
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

    // Start floating animation
    setInterval(createFloating, 1200);

    // ---------- SCROLL REVEAL ----------
    const cards = document.querySelectorAll('.card');
    
    function revealCards() {
      const windowHeight = window.innerHeight;
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight - 80 && rect.bottom > 20) {
          card.classList.add('revealed');
        }
      });
    }

    window.addEventListener('scroll', revealCards, { passive: true });
    window.addEventListener('resize', revealCards);
    revealCards(); // Initial check

    // ---------- CURSOR CONTROL FOR DEVICES ----------
    function handleDeviceChange() {
      if (!document.body) return;
      
      if (window.matchMedia('(hover: hover)').matches) {
        document.body.style.cursor = 'none';
      } else {
        document.body.style.cursor = 'auto';
      }
    }
    
    // Check for matchMedia support
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(hover: hover)');
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleDeviceChange);
      } else if (mediaQuery.addListener) {
        // Older browsers
        mediaQuery.addListener(handleDeviceChange);
      }
      
      handleDeviceChange();
    }

    // ---------- FALLBACK FOR TOUCH DEVICES ----------
    if ('ontouchstart' in window) {
      document.body.style.cursor = 'auto';
      if (cursor) cursor.style.display = 'none';
    }

    console.log('Barbie Store initialized successfully! ✨');
  });
})();
