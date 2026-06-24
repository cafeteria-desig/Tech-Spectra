export function renderNavbar(): HTMLElement {
  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="#" data-page="home" class="nav-logo">
        <img src="/logo.png" alt="Tech Spectra" class="nav-logo-img" />
        <span class="nav-logo-text">Tech Spectra</span>
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="#" data-page="home" class="nav-link active">Home</a></li>
        <li><a href="#" data-page="events" class="nav-link">Events</a></li>
        <li><a href="#" data-page="schedule" class="nav-link">Schedule</a></li>
        <li><a href="#" data-page="contact" class="nav-link">Contact</a></li>
        <li><a href="#" data-page="register" class="nav-link register-link">Register</a></li>
        <li><a href="#" data-page="admin-login" class="nav-link admin-link">Admin</a></li>
      </ul>
    </div>
  `;

  // Mobile toggle
  const toggle = nav.querySelector('.nav-toggle')!;
  const links = nav.querySelector('.nav-links')!;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // Scroll effect
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    },
    { passive: true },
  );

  return nav;
}
