document.addEventListener('DOMContentLoaded', function () {
  // Anno corrente nel footer
  var annoEl = document.getElementById('anno');
  if (annoEl) {
    annoEl.textContent = new Date().getFullYear();
  }

  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Chiude il menu quando si clicca un link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Galleria: scorrimento con frecce
  var track = document.querySelector('.galleria-track');
  var prevArrow = document.querySelector('.galleria-arrow-prev');
  var nextArrow = document.querySelector('.galleria-arrow-next');
  var thumbs = document.querySelectorAll('.galleria-thumb');

  if (track && thumbs.length) {
    var scrollStep = function () {
      var item = track.querySelector('.galleria-item');
      return item ? item.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    };

    if (prevArrow) {
      prevArrow.addEventListener('click', function () {
        track.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
      });
    }
    if (nextArrow) {
      nextArrow.addEventListener('click', function () {
        track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
      });
    }
  }

  // Lightbox: apertura foto a schermo intero
  var lightbox = document.getElementById('lightbox');

  if (lightbox && thumbs.length) {
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-arrow-prev');
    var lbNext = lightbox.querySelector('.lightbox-arrow-next');

    var images = Array.prototype.map.call(thumbs, function (btn) {
      var img = btn.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    });

    var currentIndex = 0;
    var lastFocused = null;

    function showImage(index) {
      currentIndex = (index + images.length) % images.length;
      var data = images[currentIndex];
      lbImg.src = data.src;
      lbImg.alt = data.alt || '';
      lbCaption.textContent = data.alt || '';
    }

    function onKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      showImage(index);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      document.addEventListener('keydown', onKeydown);
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    thumbs.forEach(function (btn, index) {
      btn.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { showImage(currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Swipe su touch per passare da una foto all'altra
    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        showImage(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      }
      touchStartX = null;
    });
  }
});
