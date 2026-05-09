document.addEventListener('DOMContentLoaded', function () {

  /* ── FALLING PETALS ── */
  var canvas = document.getElementById('petals-canvas');
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var COLORS = [
    'rgba(197,114,106,0.25)',
    'rgba(232,180,174,0.2)',
    'rgba(201,169,110,0.2)',
    'rgba(249,237,233,0.3)'
  ];

  function Petal() { this.reset(true); }

  Petal.prototype.reset = function (initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.r = 4 + Math.random() * 7;
    this.speed = 0.4 + Math.random() * 0.8;
    this.drift = (Math.random() - 0.5) * 0.6;
    this.spin = (Math.random() - 0.5) * 0.04;
    this.angle = Math.random() * Math.PI * 2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  Petal.prototype.update = function () {
    this.y += this.speed;
    this.x += this.drift;
    this.angle += this.spin;
    if (this.y > canvas.height + 20) this.reset(false);
  };

  Petal.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };

  var petals = [];
  for (var i = 0; i < 38; i++) { petals.push(new Petal()); }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(function (p) { p.update(); p.draw(); });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  /* ── LETTER ── */
  var letterOpened = false;
  var envelope = document.getElementById('envelope');
  var letterContent = document.getElementById('letterContent');

  if (envelope && letterContent) {
    envelope.addEventListener('click', function () {
      if (letterOpened) return;
      letterOpened = true;
      envelope.style.display = 'none';
      letterContent.classList.add('open');
    });
  }

  /* ── GIFT ── */
  var giftOpened = false;
  var giftWrap = document.getElementById('giftWrap');

  if (giftWrap) {
    giftWrap.addEventListener('click', function () {
      if (giftOpened) return;
      giftOpened = true;
      document.getElementById('giftLid').classList.add('open');
      document.getElementById('giftBow').classList.add('open');
      var cta = document.getElementById('giftCta');
      if (cta) cta.style.opacity = '0';
      setTimeout(function () {
        var overlay = document.getElementById('giftPopupOverlay');
        if (overlay) {
          overlay.style.display = 'flex';
          setTimeout(function () { overlay.classList.add('active'); }, 10);
        }
      }, 700);
    });
  }

  var giftPopupClose = document.getElementById('giftPopupClose');
  var giftPopupOverlay = document.getElementById('giftPopupOverlay');

  if (giftPopupClose && giftPopupOverlay) {
    giftPopupClose.addEventListener('click', function () {
      giftPopupOverlay.classList.remove('active');
      setTimeout(function () { giftPopupOverlay.style.display = 'none'; }, 400);
    });
  }

  /* ── LIGHTBOX ── */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = this.src;
      lightbox.style.display = 'flex';
      setTimeout(function () { lightbox.classList.add('active'); }, 10);
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(function () { lightbox.style.display = 'none'; }, 350);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* -- SCROLL REVEAL -- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var mainObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          mainObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

    revealEls.forEach(function (el) {
      el.classList.add('animate');
      mainObserver.observe(el);
    });
  }

  /* ── HERO ANIMATION SAFETY FALLBACK ── */
  setTimeout(function () {
    document.querySelectorAll('.hero-eyebrow, .hero-title, .hero-sub, .divider, .hero-btn').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 2000);

});