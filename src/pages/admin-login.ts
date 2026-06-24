import { ADMIN_PASSWORD } from '../config';
import { navigate } from '../router';

export function renderAdminLogin(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page admin-login-page';

  const container = document.createElement('div');
  container.className = 'admin-login-container';

  container.innerHTML = `
    <div class="admin-login-card glow-card">
      <div class="admin-login-header">
        <div class="admin-login-icon">🔐</div>
        <h1>Admin Access</h1>
        <p>Enter the admin password to access the dashboard</p>
      </div>
      <form class="admin-login-form" id="admin-login-form" novalidate>
        <div class="form-group">
          <label for="admin-password">Password</label>
          <div class="password-input-wrapper">
            <input
              type="password"
              id="admin-password"
              placeholder="Enter admin password"
              autocomplete="current-password"
              required
            />
            <button type="button" class="password-toggle" id="password-toggle" aria-label="Toggle password visibility">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <span class="form-error" id="admin-login-error"></span>
        </div>
        <button type="submit" class="cta-button admin-login-btn" id="admin-login-btn">
          <span>Access Dashboard</span>
        </button>
      </form>
      <div class="admin-login-footer">
        <a href="#" data-page="home" class="admin-back-link">← Back to Home</a>
      </div>
    </div>
  `;

  section.appendChild(container);

  // --- Event Listeners ---

  const form = container.querySelector('#admin-login-form') as HTMLFormElement;
  const passwordInput = container.querySelector('#admin-password') as HTMLInputElement;
  const errorEl = container.querySelector('#admin-login-error') as HTMLElement;
  const toggleBtn = container.querySelector('#password-toggle') as HTMLButtonElement;
  const submitBtn = container.querySelector('#admin-login-btn') as HTMLButtonElement;

  // Password visibility toggle
  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleBtn.innerHTML = isPassword
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>`;
  });

  // Focus input on load
  setTimeout(() => passwordInput.focus(), 300);

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verifying...</span>';

    const password = passwordInput.value.trim();

    // Simple delay to prevent brute force feel
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        navigate('admin');
      } else {
        errorEl.textContent = 'Invalid password. Please try again.';
        errorEl.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Access Dashboard</span>';
      }
    }, 600);
  });

  return section;
}
