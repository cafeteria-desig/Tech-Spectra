import './style.css';
import { renderNavbar } from './components/navbar.ts';
import { renderFooter } from './components/footer.ts';
import { startParticles } from './particles.ts';
import { setupRouter, registerRoute, navigate } from './router.ts';
import { renderHome } from './pages/home.ts';
import { renderEvents } from './pages/events.ts';
import { renderSchedule } from './pages/schedule.ts';
import { renderRegister, cleanupRegister } from './pages/register.ts';
import { renderContact } from './pages/contact.ts';
import { renderAdminLogin } from './pages/admin-login.ts';
import { renderAdmin, cleanupAdmin } from './pages/admin.ts';

async function init(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  // Create page container
  const pageContainer = document.createElement('div');
  pageContainer.id = 'page-container';
  app.appendChild(pageContainer);

  // Register routes
  registerRoute('home', renderHome);
  registerRoute('events', renderEvents);
  registerRoute('schedule', renderSchedule);
  registerRoute('register', renderRegister, cleanupRegister);
  registerRoute('contact', renderContact);
  registerRoute('admin-login', renderAdminLogin);
  registerRoute('admin', renderAdmin, cleanupAdmin);

  // Setup SPA router
  setupRouter();

  // Render navbar and footer
  const navbar = renderNavbar();
  const footer = renderFooter();

  document.body.appendChild(navbar);
  document.body.appendChild(footer);

  // Start particle system
  startParticles(document.body);

  // Navigate to home on load
  await navigate('home');

  // Set transition on app container
  app.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

document.addEventListener('DOMContentLoaded', init);
