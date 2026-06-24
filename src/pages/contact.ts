export function renderContact(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page contact-page';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Contact Us</h1>
    <p>Reach out to the Tech Spectra organizing team</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'contact-grid';

  // Left card: Contact Details
  const detailsCard = document.createElement('div');
  detailsCard.className = 'contact-card glow-card reveal';
  detailsCard.innerHTML = `
    <div class="contact-info-item">
      <div class="contact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </div>
      <div class="contact-text">
        <h4>Mobile Number</h4>
        <p><a href="tel:+918949501162">8949501162</a></p>
      </div>
    </div>

    <div class="contact-info-item">
      <div class="contact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>
      <div class="contact-text">
        <h4>Gmail ID</h4>
        <p><a href="mailto:07bhavishysankhla@gmail.com">07bhavishysankhla@gmail.com</a></p>
      </div>
    </div>

    <div class="contact-info-item">
      <div class="contact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="contact-text">
        <h4>Location</h4>
        <p>Faculty of Engineering, Lachoo Memorial College of Science & Technology,<br/>Sector-A, Shastri Nagar, Jodhpur, Rajasthan</p>
      </div>
    </div>
  `;

  // Right card: Interactive form
  const formContainer = document.createElement('div');
  formContainer.className = 'contact-form-container glow-card reveal';
  formContainer.innerHTML = `
    <form id="contact-form" class="register-form" style="padding: 0; border: none; background: transparent; box-shadow: none;">
      <h3 style="margin-bottom: 20px;">Send a Message</h3>
      <div class="form-group">
        <label for="contact-name">Name</label>
        <input type="text" id="contact-name" placeholder="Your name" required />
      </div>
      <div class="form-group">
        <label for="contact-email">Email</label>
        <input type="email" id="contact-email" placeholder="Your email address" required />
      </div>
      <div class="form-group">
        <label for="contact-message">Message</label>
        <textarea id="contact-message" placeholder="Type your message here..." rows="5" required style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-primary); font-family: inherit; font-size: 0.95rem; resize: vertical; outline: none; transition: border-color 0.25s ease;"></textarea>
      </div>
      <span class="form-error" id="contact-error" style="display: none; margin-bottom: 15px;"></span>
      <button type="submit" class="cta-button" style="width: 100%;">
        <span>Send Message</span>
      </button>
    </form>
    <div id="contact-success" style="display: none; text-align: center; padding: 40px 20px;">
      <span style="font-size: 3rem; display: block; margin-bottom: 15px;">✉️</span>
      <h3 style="margin-bottom: 10px; color: var(--text-primary);">Message Sent!</h3>
      <p style="color: var(--text-secondary); margin-bottom: 25px;">Thank you for reaching out. We will get back to you shortly.</p>
      <button class="cta-button reset-contact-btn">
        <span>Send Another Message</span>
      </button>
    </div>
  `;

  grid.appendChild(detailsCard);
  grid.appendChild(formContainer);

  section.appendChild(header);
  section.appendChild(grid);

  // Form submission handler
  const form = formContainer.querySelector('#contact-form') as HTMLFormElement;
  const successEl = formContainer.querySelector('#contact-success') as HTMLElement;
  const resetBtn = formContainer.querySelector('.reset-contact-btn') as HTMLButtonElement;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (form.querySelector('#contact-name') as HTMLInputElement).value.trim();
    const email = (form.querySelector('#contact-email') as HTMLInputElement).value.trim();
    const message = (form.querySelector('#contact-message') as HTMLTextAreaElement).value.trim();

    if (!name || !email || !message) {
      const errorEl = form.querySelector('#contact-error') as HTMLElement;
      errorEl.textContent = 'All fields are required.';
      errorEl.style.display = 'block';
      return;
    }

    // Hide form, show success screen
    form.style.display = 'none';
    successEl.style.display = 'block';
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    successEl.style.display = 'none';
    form.style.display = 'block';
  });

  return section;
}
