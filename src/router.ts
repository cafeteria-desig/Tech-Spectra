import type { Page } from './types';

type PageRenderFn = (() => HTMLElement) | (() => Promise<HTMLElement>);
type PageCleanupFn = () => void;

const routes: Record<Page, { render: PageRenderFn; cleanup?: PageCleanupFn }> =
  {} as Record<Page, { render: PageRenderFn; cleanup?: PageCleanupFn }>;

let currentCleanup: PageCleanupFn | undefined;
let currentPage: Page = 'home';

export function registerRoute(
  page: Page,
  render: PageRenderFn,
  cleanup?: PageCleanupFn,
): void {
  routes[page] = { render, cleanup };
}

function updateActiveNavLink(page: Page): void {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-page') === page);
  });
}

export async function navigate(page: Page): Promise<void> {
  const route = routes[page];
  if (!route) return;

  const app = document.getElementById('app');
  if (!app) return;

  // Run cleanup for current page
  currentCleanup?.();

  // Fade out
  app.style.opacity = '0';
  app.style.transform = 'translateY(10px)';
  app.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Render new page
  const content = await route.render();
  app.innerHTML = '';
  app.appendChild(content);

  currentPage = page;
  currentCleanup = route.cleanup;

  updateActiveNavLink(page);

  // Setup scroll reveal animations (skip on admin pages for performance)
  if (page !== 'admin' && page !== 'admin-login') {
    setupScrollReveal(content);
  }

  // Fade in
  requestAnimationFrame(() => {
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupScrollReveal(container: HTMLElement): void {
  // --- Hero sub-elements: only reveal after user scrolls ---
  const heroRevealItems = container.querySelectorAll('.hero-reveal-item');
  const heroScrollIndicator = container.querySelector('.hero-scroll-indicator');

  if (heroRevealItems.length > 0 || heroScrollIndicator) {
    let heroRevealed = false;

    const revealHero = (): void => {
      if (heroRevealed) return;
      heroRevealed = true;
      heroRevealItems.forEach((el, i) => {
        setTimeout(() => el.classList.add('scroll-revealed'), i * 150);
      });
      heroScrollIndicator?.classList.add('scroll-revealed');
      window.removeEventListener('scroll', onFirstScroll);
      window.removeEventListener('wheel', onFirstScroll);
      window.removeEventListener('touchmove', onFirstScroll);
    };

    const onFirstScroll = (): void => {
      revealHero();
    };

    window.addEventListener('scroll', onFirstScroll, { passive: true });
    window.addEventListener('wheel', onFirstScroll, { passive: true });
    window.addEventListener('touchmove', onFirstScroll, { passive: true });
  }

  // --- Below-the-fold sections: reveal only when scrolled into view ---
  const elements = container.querySelectorAll(
    '.glow-card, .wallet-card, .intro-content, .page-header, .form-section:not(.submit-section), .event-full-card, .schedule-day-header'
  );

  elements.forEach((el) => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

export function getCurrentPage(): Page {
  return currentPage;
}

export function setupRouter(): void {
  // Set up navigation click handlers
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('[data-page]');
    if (link) {
      e.preventDefault();
      const page = link.getAttribute('data-page') as Page;
      navigate(page);
    }
  });
}
