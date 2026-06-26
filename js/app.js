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
});
