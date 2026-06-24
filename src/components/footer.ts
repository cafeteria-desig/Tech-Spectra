export function renderFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.id = 'footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/logo.png" alt="Tech Spectra" class="footer-logo" />
        <h3>Tech Spectra</h3>
        <p class="footer-tagline">The Future of Work in the Age of AI</p>
      </div>
      <div class="footer-college">
        <p>Lachoo Memorial College of Science & Technology</p>
        <p class="footer-dates">29–30 June 2026</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Tech Spectra. All rights reserved.</p>
    </div>
  `;
  return footer;
}
