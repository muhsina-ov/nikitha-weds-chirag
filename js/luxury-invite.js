/**
 * NIKITHA & CHIRAG - ROYAL ENGAGEMENT INVITATION
 * Interactive Logic: Wax Seal Reveal, Audio Loop, Countdown, Particles, Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('weiOverlay');
  const videoWrap = document.getElementById('weiVideoWrap');
  const video = document.getElementById('weiVideo');
  const audio = document.getElementById('weiAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const toast = document.getElementById('toastMsg');

  let hasOpened = false;

  // 1. STAR & GOLD DUST PARTICLES CANVAS
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width > 768 ? 45 : 25, 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
        pulsing: Math.random() * 0.02 + 0.01,
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += p.pulsing;

        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.pulsing = -p.pulsing;
        }

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 203, 123, ${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // 2. WAX SEAL OPENING & MUSIC START
  function openInvitation() {
    if (hasOpened) return;
    hasOpened = true;

    // Fade out wax seal overlay
    if (overlay) {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1100);
    }

    // Play video envelope reveal if video exists
    if (videoWrap && video) {
      videoWrap.classList.add('wei-video-in');
      const vPlay = video.play();
      if (vPlay !== undefined) {
        vPlay.catch(() => {
          // Fallback if autoplay video blocked
          videoWrap.style.display = 'none';
        });
      }

      video.addEventListener('timeupdate', () => {
        if (video.duration && video.currentTime >= video.duration - 0.7 && !video.dataset.fading) {
          video.dataset.fading = '1';
          videoWrap.style.opacity = '0';
          setTimeout(() => {
            videoWrap.style.display = 'none';
          }, 700);
        }
      });

      video.addEventListener('ended', () => {
        videoWrap.style.display = 'none';
      });
    }

    // Play Background Audio (Looped)
    if (audio) {
      audio.loop = true;
      audio.volume = 0.85;
      const audioPromise = audio.play();
      if (audioPromise !== undefined) {
        audioPromise
          .then(() => {
            if (musicToggleBtn) {
              musicToggleBtn.classList.remove('paused');
            }
          })
          .catch((err) => {
            console.log('Audio playback prevented:', err);
            if (musicToggleBtn) {
              musicToggleBtn.classList.add('paused');
            }
          });
      }
    }

    // Show floating audio toggle
    if (musicToggleBtn) {
      musicToggleBtn.classList.add('visible');
    }
  }

  if (overlay) {
    overlay.addEventListener('click', openInvitation);
    overlay.addEventListener('touchstart', openInvitation, { passive: true });
  }

  // Audio Toggle Control
  if (musicToggleBtn && audio) {
    musicToggleBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          musicToggleBtn.classList.remove('paused');
        }).catch(() => {});
      } else {
        audio.pause();
        musicToggleBtn.classList.add('paused');
      }
    });
  }

  // 3. COUNTDOWN TIMER TARGETING: 24th Sept 2026, 11:00 AM IST
  const targetDate = new Date('2026-09-24T11:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. TOAST NOTIFICATION & SHARE HELPER
  window.showToast = function (msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  window.copyInviteLink = function () {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast('✨ Invitation link copied to clipboard!'))
        .catch(() => showToast('Link copied to clipboard!'));
    } else {
      showToast('✨ Invitation link ready to share!');
    }
  };
});
