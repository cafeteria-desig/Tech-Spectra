# Tech Spectra 2026 — Full Project Export

> Generated for ChatGPT analysis. Contains the complete source code of the Tech Spectra website.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Configuration Files](#configuration-files)
   - [index.html](#indexhtml)
   - [package.json](#packagejson)
   - [tsconfig.json](#tsconfigjson)
   - [.gitignore](#gitignore)
4. [Source Code — Config & Types](#source-code--config--types)
   - [config.ts](#configts)
   - [types.ts](#typests)
5. [Source Code — Entry Points](#source-code--entry-points)
   - [main.ts](#maints)
   - [router.ts](#routerts)
6. [Source Code — Core Systems](#source-code--core-systems)
   - [supabase.ts](#supabasets)
   - [particles.ts](#particlests)
7. [Source Code — UI Components](#source-code--ui-components)
   - [navbar.ts](#navbarts)
   - [footer.ts](#footerts)
8. [Source Code — Pages](#source-code--pages)
   - [home.ts](#homets)
   - [events.ts](#eventsts)
   - [schedule.ts](#schedulets)
   - [register.ts](#registerts)
   - [contact.ts](#contactts)
   - [admin-login.ts](#admin-logints)
   - [admin.ts](#admints)
9. [Styles](#styles)
   - [style.css](#stylecss)
10. [Database Setup](#database-setup)
    - [supabase-setup.sql](#supabase-setupsql)

---

## Project Overview

**Tech Spectra** is a single-page application (SPA) website for a two-day techno-cultural fest called "Tech Spectra 2026" organized by Lachoo Memorial College of Science & Technology, Jodhpur.

**Tech Stack:**
- **Frontend:** Vanilla TypeScript (no framework)
- **Build Tool:** Vite
- **Backend:** Supabase (PostgreSQL + Storage)
- **Styling:** Custom CSS with design system
- **Language:** TypeScript (strict mode)

**Key Features:**
- Interactive 3D particle background with mouse interaction
- Dynamic hero section with animated logo (pixel decomposition)
- 6 events with registration management
- Seat booking system with grid visualization
- Team registration support (up to 4 members)
- Admin dashboard with search, filter, CSV export, and ID card viewing
- SPA routing with scroll animations
- Responsive design

---

## File Structure

```
/
├── index.html
├── package.json
├── tsconfig.json
├── .gitignore
├── supabase-setup.sql
└── src/
    ├── main.ts
    ├── config.ts
    ├── router.ts
    ├── style.css
    ├── types.ts
    ├── supabase.ts
    ├── particles.ts
    ├── components/
    │   ├── navbar.ts
    │   └── footer.ts
    └── pages/
        ├── home.ts
        ├── events.ts
        ├── schedule.ts
        ├── register.ts
        ├── contact.ts
        ├── admin-login.ts
        └── admin.ts
```

---

## Configuration Files

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tech Spectra 2026</title>
    <meta name="description" content="Tech Spectra — The Future of Work in the Age of AI. A two-day techno-cultural event at Lachoo Memorial College of Science & Technology." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### package.json

```json
{
  "name": "tech-spectra",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.12"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.108.2"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## Source Code — Config & Types

### config.ts

```typescript
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Admin password for the admin dashboard
// Set via VITE_ADMIN_PASSWORD env variable, or use a secure default
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'techspectra2026';

export const EVENTS = [
  {
    name: 'Prompt War',
    day: 1,
    date: '29 June 2026',
    time: '9:00 AM – 11:00 AM',
    description:
      'A battle of wits and creativity where participants craft the most compelling AI prompts to solve real-world challenges. Showcase your ability to communicate with AI effectively.',
    rules: [
      'Participants will be given a problem statement individually.',
      'Use any AI tool of your choice to generate solutions.',
      'Judges evaluate based on creativity, precision, and output quality.',
      'Time limit: 2 hours.',
    ],
    eligibility: 'Open to all students. No prior AI experience required.',
    rulebookUrl: '/rules/prompt-wars-rulebook.pdf',
  },
  {
    name: 'Hackathon',
    day: 1,
    date: '29 June 2026',
    time: '11:30 AM – 1:30 PM',
    description:
      'Form your dream team and build something amazing from scratch in this high-energy coding marathon. Innovation meets execution.',
    rules: [
      'Teams of 2–4 members.',
      'Problem statements will be revealed at the start.',
      'Any tech stack is allowed.',
      'Final submission via GitHub repository.',
    ],
    eligibility: 'Open to all students with basic programming knowledge.',
    rulebookUrl: '/rules/hackathon-rulebook.pdf',
  },
  {
    name: 'Nukkad Natak (Street Play)',
    day: 1,
    date: '29 June 2026',
    time: '1:30 PM – 3:00 PM',
    description:
      'Street theatre at its finest — bring social issues to life through powerful performances that captivate and inspire.',
    rules: [
      'Teams of 4–8 members.',
      'Duration: 10–15 minutes per performance.',
      'Theme must be socially relevant.',
      'Props and costumes to be arranged by the team.',
    ],
    eligibility: 'Open to all students. No prior acting experience needed.',
  },
  {
    name: 'Short Movie',
    day: 2,
    date: '30 June 2026',
    time: '9:00 AM – 11:00 AM',
    description:
      'Lights, camera, action! Create a short film that tells a compelling story in limited time. Showcase your filmmaking prowess.',
    rules: [
      'Teams of up to 5 members.',
      'Duration: 5–10 minutes.',
      'Theme will be provided on the spot.',
      'Entries must be submitted in MP4 format.',
    ],
    eligibility: 'Open to all students. Bring your own camera/phone.',
  },
  {
    name: 'Shark Tank',
    day: 2,
    date: '30 June 2026',
    time: '11:30 AM – 1:30 PM',
    description:
      'Pitch your business idea to a panel of "sharks" and compete for the best startup concept. Convince them to invest in your vision.',
    rules: [
      'Individual or teams of up to 3 members.',
      'Pitch duration: 5 minutes + 3 minutes Q&A.',
      'Present a business model, market analysis, and revenue plan.',
      'Bring pitch decks on a USB drive.',
    ],
    eligibility: 'Open to all students with an entrepreneurial mindset.',
  },
  {
    name: 'Instrumental Singing',
    day: 2,
    date: '30 June 2026',
    time: '1:30 PM – 3:00 PM',
    description:
      'Let your voice and instrument harmonize in this musical showcase. Solo or duet performances that stir the soul.',
    rules: [
      'Solo or duet performances.',
      'Duration: 5–7 minutes.',
      'Instruments (except piano) to be arranged by participant.',
      'Karaoke tracks are not allowed — live accompaniment only.',
    ],
    eligibility: 'Open to all students who sing or play instruments.',
  },
] as const;

export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E'];
export const SEAT_COLS = 20;
export const TOTAL_SEATS = 100;
```

### types.ts

```typescript
export interface Registration {
  id?: string;
  full_name: string;
  college_name: string;
  email: string;
  phone: string;
  id_card_url: string;
  events_selected: string[];
  seat_number: string;
  hackathon_problem?: string;
  shark_tank_problem?: string;
  registered_at?: string;
}

export interface Seat {
  id: string; // e.g. "A1", "B5"
  booked: boolean;
}

export type Page = 'home' | 'events' | 'schedule' | 'register' | 'contact' | 'admin' | 'admin-login';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  baseX?: number;
  baseY?: number;
  isDispersed?: boolean;
  angle?: number;
}
```

---

## Source Code — Entry Points

### main.ts

```typescript
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
```

### router.ts

```typescript
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
```

---

## Source Code — Core Systems

### supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import type { Registration } from './types';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.',
  );
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
);

export async function getBookedSeats(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('seat_number');

    if (error) throw error;
    return (data ?? []).map((r: { seat_number: string }) => r.seat_number);
  } catch (err) {
    console.error('Failed to fetch booked seats:', err);
    throw new Error('Could not load seat availability. Please refresh the page.');
  }
}

export async function uploadIdCard(
  file: File,
  email: string,
): Promise<string> {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
        .from('id-cards')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('id-cards')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload ID card:', err);
    throw new Error('Could not upload ID card. Please try again.');
  }
}

export async function checkSeatAvailability(
  seatNumber: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('seat_number', seatNumber)
      .maybeSingle();

    if (error) throw error;
    return !data;
  } catch (err) {
    console.error('Failed to check seat availability:', err);
    throw new Error('Could not verify seat availability. Please try again.');
  }
}

export async function getAllRegistrations(): Promise<Registration[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('Failed to fetch registrations:', err);
    throw new Error('Could not load registrations. Please try again.');
  }
}

export async function submitRegistration(
  registration: Registration,
): Promise<void> {
  try {
    const payload: any = {
      full_name: registration.full_name,
      college_name: registration.college_name,
      email: registration.email,
      phone: registration.phone,
      id_card_url: registration.id_card_url,
      events_selected: registration.events_selected,
      seat_number: registration.seat_number,
    };
    if (registration.hackathon_problem) {
      payload.hackathon_problem = registration.hackathon_problem;
    }
    if (registration.shark_tank_problem) {
      payload.shark_tank_problem = registration.shark_tank_problem;
    }
    const { error } = await supabase.from('registrations').insert([payload]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to submit registration:', err);
    throw new Error('Registration failed. Please try again.');
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to delete registration:', err);
    throw new Error('Could not delete registration. Please try again.');
  }
}
```

### particles.ts

```typescript
import type { Particle } from './types';

const PARTICLE_COUNT = 250;
const MAX_SPEED = 0.4;
const DISPERSE_FORCE = 12;
const RETURN_FORCE = 0.005;
const CONNECT_DISTANCE = 120;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let particles: Particle[] = [];
let mouseX = -1000;
let mouseY = -1000;
let animationId = 0;
let isRunning = false;

function initParticles(w: number, h: number): void {
  particles = Array.from({ length: PARTICLE_COUNT }, () => {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      isDispersed: true,
    };
  });
}

function drawParticle(p: Particle): void {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(26, 107, 255, ${p.alpha})`;
  ctx.fill();
}

function drawConnections(): void {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECT_DISTANCE) {
        const alpha = (1 - dist / CONNECT_DISTANCE) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(26, 107, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate(): void {
  if (!isRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
      p.isDispersed = true;
      const force = (1 - dist / 120) * DISPERSE_FORCE;
      p.vx += (dx / dist) * force * 0.15;
      p.vy += (dy / dist) * force * 0.15;
      p.alpha = Math.min(p.baseAlpha * 1.5, 0.9);
    }

    p.vx += (Math.random() - 0.5) * RETURN_FORCE;
    p.vy += (Math.random() - 0.5) * RETURN_FORCE;
    p.alpha += (p.baseAlpha - p.alpha) * 0.02;

    p.vx *= 0.98;
    p.vy *= 0.98;

    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > MAX_SPEED * 3) {
      p.vx = (p.vx / speed) * MAX_SPEED * 3;
      p.vy = (p.vy / speed) * MAX_SPEED * 3;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    drawParticle(p);
  }

  drawConnections();
  animationId = requestAnimationFrame(animate);
}

function handleResize(): void {
  const oldW = canvas.width;
  const oldH = canvas.height;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const w = canvas.width;
  const h = canvas.height;

  particles.forEach((p) => {
    p.x = (p.x / oldW) * w;
    p.y = (p.y / oldH) * h;
  });
}

function handleMouseMove(e: MouseEvent): void {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function handleMouseLeave(): void {
  mouseX = -1000;
  mouseY = -1000;
}

export function startParticles(container: HTMLElement): void {
  if (isRunning) return;

  canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.prepend(canvas);

  ctx = canvas.getContext('2d')!;
  initParticles(canvas.width, canvas.height);
  isRunning = true;

  window.addEventListener('resize', handleResize);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);

  animate();
}

export function stopParticles(): void {
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseleave', handleMouseLeave);
  canvas?.remove();
}
```

---

## Source Code — UI Components

### navbar.ts

```typescript
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
```

### footer.ts

```typescript
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
```

---

## Source Code — Pages

### home.ts

```typescript
import { EVENTS } from '../config';

// Global variables for cleaning up animation frame and event listeners
let animationFrameId: number | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseLeaveHandler: (() => void) | null = null;

interface PixelObject {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  rotation: number;
  glow: number;
  targetX: number;
  targetY: number;
  targetRotation: number;
  targetGlow: number;
}

interface EndpointPulse {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export function renderHome(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page home-page';

  // S-Ribbon Bezier Path Definition (1024x1024 coordinate space)
  const getSPoint = (t: number): { x: number; y: number } => {
    if (t < 0.5) {
      const nt = t * 2;
      const p0 = { x: 250, y: 710 };
      const p1 = { x: 350, y: 680 };
      const p2 = { x: 600, y: 600 };
      const p3 = { x: 430, y: 480 };
      const mt = 1 - nt;
      return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * nt * p1.x + 3 * mt * nt * nt * p2.x + nt * nt * nt * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * nt * p1.y + 3 * mt * nt * nt * p2.y + nt * nt * nt * p3.y,
      };
    } else {
      const nt = (t - 0.5) * 2;
      const p0 = { x: 430, y: 480 };
      const p1 = { x: 260, y: 360 };
      const p2 = { x: 480, y: 260 };
      const p3 = { x: 570, y: 240 };
      const mt = 1 - nt;
      return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * nt * p1.x + 3 * mt * nt * nt * p2.x + nt * nt * nt * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * nt * p1.y + 3 * mt * nt * nt * p2.y + nt * nt * nt * p3.y,
      };
    }
  };

  const circuitPaths = [
    {
      points: [
        { x: 550, y: 420 },
        { x: 610, y: 420 },
        { x: 640, y: 390 },
        { x: 700, y: 390 },
        { x: 730, y: 360 },
        { x: 780, y: 360 },
      ],
    },
    {
      points: [
        { x: 560, y: 440 },
        { x: 630, y: 440 },
        { x: 660, y: 410 },
        { x: 740, y: 410 },
        { x: 755, y: 395 },
        { x: 815, y: 395 },
      ],
    },
    {
      points: [
        { x: 580, y: 470 },
        { x: 650, y: 470 },
        { x: 680, y: 455 },
        { x: 860, y: 455 },
      ],
    },
    {
      points: [
        { x: 570, y: 490 },
        { x: 640, y: 490 },
        { x: 670, y: 475 },
        { x: 780, y: 475 },
        { x: 790, y: 485 },
        { x: 825, y: 485 },
      ],
    },
    {
      points: [
        { x: 560, y: 510 },
        { x: 610, y: 510 },
        { x: 635, y: 520 },
        { x: 720, y: 520 },
        { x: 730, y: 530 },
        { x: 750, y: 530 },
        { x: 760, y: 520 },
        { x: 780, y: 520 },
      ],
    },
    {
      points: [
        { x: 550, y: 530 },
        { x: 600, y: 530 },
        { x: 620, y: 550 },
        { x: 770, y: 550 },
      ],
    },
    {
      points: [
        { x: 540, y: 550 },
        { x: 590, y: 550 },
        { x: 610, y: 570 },
        { x: 745, y: 570 },
      ],
    },
    {
      points: [
        { x: 530, y: 575 },
        { x: 580, y: 575 },
        { x: 600, y: 595 },
        { x: 690, y: 595 },
      ],
    },
  ];

  function getPointOnPath(points: { x: number; y: number }[], t: number): { x: number; y: number } {
    if (points.length === 0) return { x: 0, y: 0 };
    if (points.length === 1) return points[0];
    if (t <= 0) return points[0];
    if (t >= 1) return points[points.length - 1];

    const totalSegments = points.length - 1;
    const scaledT = t * totalSegments;
    const index = Math.floor(scaledT);
    const segmentT = scaledT - index;

    const p0 = points[index];
    const p1 = points[index + 1];

    return {
      x: p0.x + (p1.x - p0.x) * segmentT,
      y: p0.y + (p1.y - p0.y) * segmentT,
    };
  }

  const taglineText = "The Future of Work in the Age of AI";
  const taglineHTML = taglineText
    .split('')
    .map((char, index) => {
      const displayChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="tagline-char" style="transition-delay: ${index * 30 + 1000}ms">${displayChar}</span>`;
    })
    .join('');

  // Hero section
  const hero = document.createElement('div');
  hero.className = 'hero-section';
  hero.innerHTML = `
    <div class="hero-logo-container">
      <canvas id="hero-logo-canvas" width="1024" height="1024"></canvas>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-tech">TECH</span>
        <span class="hero-title-spectra">SPECTRA</span>
      </h1>
      <p class="hero-techfest">TECH FEST</p>
      <p class="hero-tagline">${taglineHTML}</p>
      <p class="hero-date">29–30 June 2026 · Lachoo Memorial College of Science & Technology</p>
      <a href="#" data-page="register" class="cta-button">
        <span>Register Now</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
    <div class="hero-scroll-indicator">
      <span>Scroll to explore</span>
      <div class="scroll-arrow"></div>
    </div>
  `;

  // Start text animations sequentially
  setTimeout(() => {
    hero.querySelector('.hero-logo-container')?.classList.add('reveal-active');
    hero.querySelector('.hero-title-tech')?.classList.add('reveal-active');
  }, 100);
  setTimeout(() => {
    hero.querySelector('.hero-title-spectra')?.classList.add('reveal-active');
  }, 400);
  setTimeout(() => {
    hero.querySelector('.hero-techfest')?.classList.add('reveal-active');
  }, 700);
  setTimeout(() => {
    hero.querySelector('.hero-tagline')?.classList.add('reveal-active');
    hero.querySelector('.hero-date')?.classList.add('reveal-active');
    hero.querySelector('.cta-button')?.classList.add('reveal-active');
    hero.querySelector('.hero-scroll-indicator')?.classList.add('reveal-active');
  }, 1000);

  // Setup interactive logo canvas
  const canvas = hero.querySelector('#hero-logo-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const logoImg = new Image();
  logoImg.src = '/logo.png';
  logoImg.onload = () => {
    const w = 1024;
    const h = 1024;

    const segCanvas = document.createElement('canvas');
    segCanvas.width = w;
    segCanvas.height = h;
    const segCtx = segCanvas.getContext('2d')!;
    segCtx.drawImage(logoImg, 0, 0, w, h);

    const imgData = segCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Convert black/dark background to transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r + g + b < 30) {
        data[i + 3] = 0;
      }
    }

    const visited = new Uint8Array(w * h);
    const pixelsList: PixelObject[] = [];

    // Bounding box scan for pixels in top-right
    for (let y = 0; y < 450; y++) {
      for (let x = 500; x < w; x++) {
        const idx = (y * w + x) * 4;
        const alpha = data[idx + 3];
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = r + g + b;

        if (brightness > 40 && alpha > 20 && !visited[y * w + x]) {
          const queue: [number, number][] = [[x, y]];
          visited[y * w + x] = 1;
          let minX = x;
          let maxX = x;
          let minY = y;
          let maxY = y;
          const componentCoords: [number, number][] = [];

          let head = 0;
          while (head < queue.length) {
            const [cx, cy] = queue[head++];
            componentCoords.push([cx, cy]);

            const dirs = [
              [0, 1],
              [0, -1],
              [1, 0],
              [-1, 0],
            ];
            for (const [dx, dy] of dirs) {
              const nx = cx + dx;
              const ny = cy + dy;
              if (nx >= 500 && nx < w && ny >= 0 && ny < 450) {
                const nIdx = (ny * w + nx) * 4;
                const nBr = data[nIdx] + data[nIdx + 1] + data[nIdx + 2];
                if (nBr > 40 && data[nIdx + 3] > 20 && !visited[ny * w + nx]) {
                  visited[ny * w + nx] = 1;
                  queue.push([nx, ny]);
                  if (nx < minX) minX = nx;
                  if (nx > maxX) maxX = nx;
                  if (ny < minY) minY = ny;
                  if (ny > maxY) maxY = ny;
                }
              }
            }
          }

          const compW = maxX - minX + 1;
          const compH = maxY - minY + 1;

          if (compW < 45 && compH < 45) {
            const pixCanvas = document.createElement('canvas');
            pixCanvas.width = compW;
            pixCanvas.height = compH;
            const pixCtx = pixCanvas.getContext('2d')!;
            const pixImgData = pixCtx.createImageData(compW, compH);

            for (const [px, py] of componentCoords) {
              const srcIdx = (py * w + px) * 4;
              const dstIdx = ((py - minY) * compW + (px - minX)) * 4;
              pixImgData.data[dstIdx] = data[srcIdx];
              pixImgData.data[dstIdx + 1] = data[srcIdx + 1];
              pixImgData.data[dstIdx + 2] = data[srcIdx + 2];
              pixImgData.data[dstIdx + 3] = data[srcIdx + 3];

              data[srcIdx] = 0;
              data[srcIdx + 1] = 0;
              data[srcIdx + 2] = 0;
              data[srcIdx + 3] = 0;
            }

            pixCtx.putImageData(pixImgData, 0, 0);

            pixelsList.push({
              canvas: pixCanvas,
              width: compW,
              height: compH,
              baseX: minX + compW / 2,
              baseY: minY + compH / 2,
              x: minX + compW / 2,
              y: minY + compH / 2,
              rotation: 0,
              glow: 0,
              targetX: minX + compW / 2,
              targetY: minY + compH / 2,
              targetRotation: 0,
              targetGlow: 0,
            });
          }
        }
      }
    }

    segCtx.putImageData(imgData, 0, 0);
    const mainLogoImg = new Image();
    mainLogoImg.src = segCanvas.toDataURL();

    let clientMouseX = -1000;
    let clientMouseY = -1000;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    mouseMoveHandler = (e: MouseEvent) => {
      clientMouseX = e.clientX;
      clientMouseY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      const canvasCenterX = rect.left + rect.width / 2;
      const canvasCenterY = rect.top + rect.height / 2;

      const dx = clientMouseX - canvasCenterX;
      const dy = clientMouseY - canvasCenterY;

      targetRotateY = Math.max(-4, Math.min(4, (dx / (window.innerWidth / 2)) * 4));
      targetRotateX = Math.max(-4, Math.min(4, -(dy / (window.innerHeight / 2)) * 4));
    };

    mouseLeaveHandler = () => {
      clientMouseX = -1000;
      clientMouseY = -1000;
      targetRotateX = 0;
      targetRotateY = 0;
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseleave', mouseLeaveHandler);

    let lastTime = 0;
    const pulses: EndpointPulse[] = [];
    let lastSignalCycle = 0;

    const animateLogo = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;

      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      const floatY = (Math.sin((timestamp * Math.PI * 2) / 5000) - 1) * 4;

      canvas.style.transform = `translateY(${floatY}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

      const rect = canvas.getBoundingClientRect();
      const localMouseX = ((clientMouseX - rect.left) / rect.width) * w;
      const localMouseY = ((clientMouseY - rect.top) / rect.height) * h;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(mainLogoImg, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      const ribbonT = (timestamp % 4000) / 4000;
      const ribbonPt = getSPoint(ribbonT);

      const pulseGrad = ctx.createRadialGradient(ribbonPt.x, ribbonPt.y, 0, ribbonPt.x, ribbonPt.y, 70);
      pulseGrad.addColorStop(0, 'rgba(0, 255, 255, 1)');
      pulseGrad.addColorStop(0.3, 'rgba(0, 191, 255, 0.8)');
      pulseGrad.addColorStop(1, 'rgba(0, 191, 255, 0)');

      ctx.beginPath();
      ctx.arc(ribbonPt.x, ribbonPt.y, 70, 0, Math.PI * 2);
      ctx.fillStyle = pulseGrad;
      ctx.fill();
      ctx.restore();

      const circuitT = (timestamp % 2000) / 2000;

      if (circuitT < lastSignalCycle) {
        for (const path of circuitPaths) {
          pulses.push({
            x: path.points[path.points.length - 1].x,
            y: path.points[path.points.length - 1].y,
            radius: 2,
            alpha: 1.0,
          });
        }
      }
      lastSignalCycle = circuitT;

      ctx.save();
      for (const path of circuitPaths) {
        const pt = getPointOnPath(path.points, circuitT);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 1.5;
        p.alpha -= 0.05;
        if (p.alpha <= 0) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${p.alpha})`;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();

      const breatheScale = 1.04 + 0.04 * Math.sin((timestamp * Math.PI * 2) / 4000);

      for (const pixel of pixelsList) {
        let hoverActive = false;
        let dx = 0;
        let dy = 0;
        let distance = 9999;

        if (clientMouseX !== -1000) {
          dx = pixel.baseX - localMouseX;
          dy = pixel.baseY - localMouseY;
          distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            hoverActive = true;
          }
        }

        if (hoverActive) {
          const len = distance || 1;
          const force = (1 - distance / 120) * 30;
          pixel.targetX = pixel.baseX + (dx / len) * force;
          pixel.targetY = pixel.baseY + (dy / len) * force;
          pixel.targetRotation = (dx / len) * (10 * Math.PI / 180);
          pixel.targetGlow = (1 - distance / 120) * 15;
        } else {
          pixel.targetX = pixel.baseX;
          pixel.targetY = pixel.baseY;
          pixel.targetRotation = 0;
          pixel.targetGlow = 0;
        }

        pixel.x += (pixel.targetX - pixel.x) * 0.12;
        pixel.y += (pixel.targetY - pixel.y) * 0.12;
        pixel.rotation += (pixel.targetRotation - pixel.rotation) * 0.12;
        pixel.glow += (pixel.targetGlow - pixel.glow) * 0.12;

        ctx.save();
        ctx.translate(pixel.x, pixel.y);
        const finalScale = hoverActive ? breatheScale * 1.1 : breatheScale;
        ctx.scale(finalScale, finalScale);
        ctx.rotate(pixel.rotation);

        if (pixel.glow > 0.5) {
          ctx.shadowColor = 'rgba(0, 191, 255, 0.8)';
          ctx.shadowBlur = pixel.glow;
        }
        ctx.drawImage(pixel.canvas, -pixel.width / 2, -pixel.height / 2);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animateLogo);
    };

    animationFrameId = requestAnimationFrame(animateLogo);
  };

  // Introduction section
  const intro = document.createElement('div');
  intro.className = 'intro-section';
  intro.innerHTML = `
    <div class="intro-content">
      <h2>Welcome to Tech Spectra</h2>
      <p>
        Tech Spectra is a two-day techno-cultural extravaganza celebrating
        the intersection of technology, creativity, and human potential. From
        coding battles to street plays, from cinematic storytelling to
        entrepreneurial pitches — experience the future of work in the age of AI.
      </p>
    </div>
  `;

  // Events preview section
  const eventsPreview = document.createElement('div');
  eventsPreview.className = 'events-preview-section';
  eventsPreview.innerHTML = `<h2 class="section-title">Featured Events</h2>`;
  const wallet = document.createElement('div');
  wallet.className = 'wallet-stack';

  for (const event of EVENTS) {
    const card = document.createElement('div');
    card.className = 'wallet-card';
    card.innerHTML = `
      <div class="wallet-card-header">
        <div class="wallet-card-left">
          <span class="wallet-day-badge">Day ${event.day}</span>
          <h3 class="wallet-card-title">${event.name}</h3>
        </div>
        <div class="wallet-card-right">
          <span class="wallet-time">${event.time}</span>
          <svg class="wallet-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>
      <div class="wallet-card-body">
        <p class="wallet-desc">${event.description}</p>
        <div class="wallet-meta">
          <span class="wallet-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${event.date}
          </span>
          <a href="#" data-page="events" class="wallet-learn-more">View Details →</a>
        </div>
      </div>
    `;
    wallet.appendChild(card);
  }

  eventsPreview.appendChild(wallet);

  section.appendChild(hero);
  section.appendChild(intro);
  section.appendChild(eventsPreview);

  return section;
}

export function cleanupHome(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
  if (mouseLeaveHandler) {
    document.removeEventListener('mouseleave', mouseLeaveHandler);
    mouseLeaveHandler = null;
  }
}
```

### events.ts

```typescript
import { EVENTS } from '../config';

export function renderEvents(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page events-page';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Events</h1>
    <p>Explore our six exciting competitions across two days</p>
  `;

  const grid = document.createElement('div');
  grid.className = 'events-full-grid';

  for (const event of EVENTS) {
    const card = document.createElement('div');
    card.className = 'event-full-card glow-card';

    const rulesList = document.createElement('ul');
    rulesList.className = 'event-rules';
    for (const rule of event.rules) {
      const li = document.createElement('li');
      li.textContent = rule;
      rulesList.appendChild(li);
    }

    const rulebookUrl = 'rulebookUrl' in event ? (event as { rulebookUrl: string }).rulebookUrl : undefined;

    card.innerHTML = `
      <div class="event-full-header">
        <span class="event-day-badge">Day ${event.day}</span>
        <h2>${event.name}</h2>
      </div>
      <div class="event-full-meta">
        <span class="event-time">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          ${event.date} · ${event.time}
        </span>
      </div>
      <p class="event-full-desc">${event.description}</p>
      <div class="event-full-section">
        <h3>Rules & Guidelines</h3>
      </div>
      <div class="event-full-section">
        <h3>Eligibility</h3>
        <p class="event-eligibility">${event.eligibility}</p>
      </div>
      <div class="event-actions">
        ${rulebookUrl ? `<a href="${rulebookUrl}" target="_blank" rel="noopener noreferrer" class="event-rulebook-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          View Rules
        </a>` : ''}
        <a href="#" data-page="register" class="event-register-link">Register for this event →</a>
      </div>
    `;

    card.querySelector('.event-full-section')!.after(rulesList);

    grid.appendChild(card);
  }

  section.appendChild(header);
  section.appendChild(grid);

  return section;
}
```

### schedule.ts

```typescript
import { EVENTS } from '../config';

export function renderSchedule(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'page schedule-page';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Schedule</h1>
    <p>Two days of innovation, creativity, and inspiration</p>
  `;

  const columns = document.createElement('div');
  columns.className = 'schedule-columns';

  // Group events by day
  const day1Events = EVENTS.filter((e) => e.day === 1);
  const day2Events = EVENTS.filter((e) => e.day === 2);

  for (const [dayLabel, dayEvents, dayDate] of [
    ['Day 1', day1Events, '29 June 2026'],
    ['Day 2', day2Events, '30 June 2026'],
  ] as const) {
    const column = document.createElement('div');
    column.className = 'schedule-column';
    column.innerHTML = `
      <div class="schedule-day-header">
        <h2>${dayLabel}</h2>
        <p class="schedule-date">${dayDate}</p>
      </div>
      <div class="schedule-timeline">
        <div class="timeline-line"></div>
        ${dayEvents
          .map(
            (event, i) => `
          <div class="timeline-item" style="--item-index: ${i}">
            <div class="timeline-dot"></div>
            <div class="timeline-content glow-card">
              <span class="timeline-time">${event.time}</span>
              <h3>${event.name}</h3>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
    columns.appendChild(column);
  }

  section.appendChild(header);
  section.appendChild(columns);

  // Trigger timeline animation on scroll using IntersectionObserver
  requestAnimationFrame(() => {
    const items = section.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        }
      },
      { threshold: 0.3 },
    );
    items.forEach((item) => observer.observe(item));
  });

  return section;
}
```

### contact.ts

```typescript
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
        <p>Lachoo Memorial College of Science & Technology,<br/>Sector-A, Shastri Nagar, Jodhpur, Rajasthan</p>
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
```

### register.ts

```typescript
import {
  getBookedSeats,
  uploadIdCard,
  checkSeatAvailability,
  submitRegistration,
} from '../supabase';
import { EVENTS, SEAT_ROWS, SEAT_COLS, TOTAL_SEATS } from '../config';
import { navigate } from '../router';

interface RegistrationFormState {
  registrationType: 'single' | 'team';
  teamName: string;
  teamSize: number;
  teamMembers: string[];
  fullName: string;
  collegeName: string;
  email: string;
  phone: string;
  idCards: (File | null)[];
  selectedEvents: string[];
  selectedSeats: string[];
  hackathonProblem: string;
  sharkTankProblem: string;
}

let formState: RegistrationFormState = {
  registrationType: 'single',
  teamName: '',
  teamSize: 1,
  teamMembers: [],
  fullName: '',
  collegeName: '',
  email: '',
  phone: '',
  idCards: [],
  selectedEvents: [],
  selectedSeats: [],
  hackathonProblem: '',
  sharkTankProblem: '',
};

let bookedSeats: Set<string> = new Set();
let isSubmitting = false;

function renderSeatGrid(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'seat-grid-container';

  const title = document.createElement('h2');
  title.className = 'seat-grid-title';
  title.textContent = 'Book Your Seat';
  container.appendChild(title);

  const counter = document.createElement('p');
  counter.className = 'seat-counter';
  counter.id = 'seat-counter';
  container.appendChild(counter);

  const grid = document.createElement('div');
  grid.className = 'seat-grid';

  for (const row of SEAT_ROWS) {
    for (let col = 1; col <= SEAT_COLS; col++) {
      if (col === 11) {
        const spacer = document.createElement('div');
        spacer.className = 'seat-spacer';
        grid.appendChild(spacer);
      }
      const seatId = `${row}${col}`;
      const seat = document.createElement('button');
      seat.type = 'button';
      seat.className = 'seat';
      seat.dataset.seat = seatId;
      seat.textContent = seatId;

      seat.addEventListener('click', () => handleSeatClick(seatId));
      grid.appendChild(seat);
    }
  }

  container.appendChild(grid);

  const legend = document.createElement('div');
  legend.className = 'seat-legend';
  legend.innerHTML = `
    <div class="seat-legend-item"><span class="seat-sample available"></span> Available</div>
    <div class="seat-legend-item"><span class="seat-sample selected"></span> Selected</div>
    <div class="seat-legend-item"><span class="seat-sample booked"></span> Booked</div>
  `;
  container.appendChild(legend);

  return container;
}

async function loadSeats(): Promise<void> {
  try {
    bookedSeats = new Set(await getBookedSeats());
  } catch {
    // Silently handle - seats will just show as available
  }
  updateSeatUI();
}

function updateSeatUI(): void {
  const seats = document.querySelectorAll('.seat');
  for (const seat of seats) {
    const id = (seat as HTMLElement).dataset.seat!;
    seat.classList.remove('selected', 'booked');

    if (bookedSeats.has(id)) {
      seat.classList.add('booked');
      (seat as HTMLButtonElement).disabled = true;
    } else if (formState.selectedSeats.includes(id)) {
      seat.classList.add('selected');
    }
  }

  const counterEl = document.getElementById('seat-counter');
  if (counterEl) {
    const takenByOthers = bookedSeats.size;
    const remaining = TOTAL_SEATS - takenByOthers;
    if (formState.registrationType === 'team') {
      counterEl.innerHTML = `Selected: <strong>${formState.selectedSeats.length} / ${formState.teamSize}</strong> seats (Team of ${formState.teamSize}). <br/> ${remaining - formState.selectedSeats.length} / ${TOTAL_SEATS} seats remaining total.`;
    } else {
      counterEl.innerHTML = `Selected: <strong>${formState.selectedSeats.length} / 1</strong> seat. <br/> ${remaining - formState.selectedSeats.length} / ${TOTAL_SEATS} seats remaining total.`;
    }
  }
}

function handleSeatClick(seatId: string): void {
  if (bookedSeats.has(seatId)) return;

  const idx = formState.selectedSeats.indexOf(seatId);
  if (idx > -1) {
    formState.selectedSeats.splice(idx, 1);
  } else {
    if (formState.selectedSeats.length < formState.teamSize) {
      formState.selectedSeats.push(seatId);
    } else {
      formState.selectedSeats.shift();
      formState.selectedSeats.push(seatId);
    }
  }

  updateSeatUI();
}

function handleMemberFileUpload(index: number, file: File): void {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    showError(`id-card-error-${index + 1}`, 'Please upload a JPG, PNG, or PDF file.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showError(`id-card-error-${index + 1}`, 'File size must be under 5MB.');
    return;
  }
  formState.idCards[index] = file;
  const fileNameEl = document.getElementById(`file-name-${index + 1}`);
  if (fileNameEl) {
    fileNameEl.textContent = file.name;
    fileNameEl.style.display = 'block';
  }
  clearError(`id-card-error-${index + 1}`);
}

function setupDragDropForMember(index: number, uploadZone: HTMLElement, input: HTMLInputElement): void {
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) handleMemberFileUpload(index, file);
  });

  uploadZone.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) handleMemberFileUpload(index, file);
  });
}

function showError(id: string, message: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearError(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function clearAllErrors(): void {
  document.querySelectorAll('.form-error').forEach((el) => {
    (el as HTMLElement).textContent = '';
    (el as HTMLElement).style.display = 'none';
  });
}

function validateStep1(): boolean {
  clearAllErrors();
  let isValid = true;

  if (formState.registrationType === 'team') {
    if (!formState.teamName.trim()) {
      showError('team-name-error', 'Team name is required.');
      isValid = false;
    }
    for (let i = 2; i <= formState.teamSize; i++) {
      const memberVal = (formState.teamMembers[i - 2] || '').trim();
      if (!memberVal) {
        showError(`member-${i}-error`, `Member ${i} name is required.`);
        isValid = false;
      }
    }
  }

  if (!formState.fullName.trim()) {
    showError('name-error', 'Full name is required.');
    isValid = false;
  }
  if (!formState.collegeName.trim()) {
    showError('college-error', 'College name is required.');
    isValid = false;
  }
  if (!formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
    showError('email-error', 'Valid email is required.');
    isValid = false;
  }
  if (!formState.phone.trim() || !/^[0-9+\-\s]{7,15}$/.test(formState.phone)) {
    showError('phone-error', 'Valid phone number is required.');
    isValid = false;
  }

  // Validate ID Cards for all members
  for (let i = 1; i <= formState.teamSize; i++) {
    if (!formState.idCards[i - 1]) {
      showError(`id-card-error-${i}`, 'Please upload college ID card.');
      isValid = false;
    }
  }

  if (formState.selectedEvents.length === 0) {
    showError('events-error', 'Please select at least one event.');
    isValid = false;
  }

  if (formState.selectedEvents.includes('Hackathon')) {
    if (!formState.hackathonProblem.trim()) {
      showError('hackathon-problem-error', 'Problem statement is required for Hackathon.');
      isValid = false;
    }
  }

  if (formState.selectedEvents.includes('Shark Tank')) {
    if (!formState.sharkTankProblem.trim()) {
      showError('shark-tank-problem-error', 'Pitch idea/problem description is required for Shark Tank.');
      isValid = false;
    }
  }

  return isValid;
}

function validateForm(): string | null {
  if (!validateStep1()) {
    return 'Please fix the errors above.';
  }
  if (formState.selectedSeats.length !== formState.teamSize) {
    const errorMsg = `Please select exactly ${formState.teamSize} seat(s) for your registration.`;
    showError('seat-error', errorMsg);
    return errorMsg;
  }

  return null;
}

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  if (isSubmitting) return;

  const error = validateForm();
  if (error) return;

  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
  }
  isSubmitting = true;

  try {
    // Check seat availability for all selected seats
    for (const seat of formState.selectedSeats) {
      const isAvailable = await checkSeatAvailability(seat);
      if (!isAvailable) {
        showError('seat-error', `Seat ${seat} was just booked. Please select another seat.`);
        bookedSeats.add(seat);
        formState.selectedSeats = formState.selectedSeats.filter(s => s !== seat);
        updateSeatUI();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Complete Registration';
        }
        isSubmitting = false;
        return;
      }
    }

    // Upload ID cards for all members in parallel
    const uploadPromises = formState.idCards.map((file, idx) => {
      const safeEmail = formState.email.trim();
      return uploadIdCard(file!, `${safeEmail}_member_${idx + 1}`);
    });
    const idCardUrls = await Promise.all(uploadPromises);

    // Submit registration for all members
    const registrationPromises = [];

    // 1. Lead member
    const leadSuffix = formState.registrationType === 'team' ? ` (Team: ${formState.teamName.trim()} - Lead)` : '';
    registrationPromises.push(submitRegistration({
      full_name: formState.fullName.trim() + leadSuffix,
      college_name: formState.collegeName.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      id_card_url: idCardUrls[0],
      events_selected: formState.selectedEvents,
      seat_number: formState.selectedSeats[0],
      hackathon_problem: formState.selectedEvents.includes('Hackathon') ? formState.hackathonProblem.trim() : undefined,
      shark_tank_problem: formState.selectedEvents.includes('Shark Tank') ? formState.sharkTankProblem.trim() : undefined,
    }));

    // 2. Team members
    if (formState.registrationType === 'team') {
      for (let i = 2; i <= formState.teamSize; i++) {
        const memberName = (formState.teamMembers[i - 2] || '').trim();
        registrationPromises.push(submitRegistration({
          full_name: memberName + ` (Team: ${formState.teamName.trim()} - Member ${i})`,
          college_name: formState.collegeName.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          id_card_url: idCardUrls[i - 1],
          events_selected: formState.selectedEvents,
          seat_number: formState.selectedSeats[i - 1],
          hackathon_problem: formState.selectedEvents.includes('Hackathon') ? formState.hackathonProblem.trim() : undefined,
          shark_tank_problem: formState.selectedEvents.includes('Shark Tank') ? formState.sharkTankProblem.trim() : undefined,
        }));
      }
    }

    await Promise.all(registrationPromises);

    // Show success modal
    showSuccessModal();
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'An unexpected error occurred.';
    showError('submit-error', msg);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Registration';
    }
    isSubmitting = false;
  }
}

function showSuccessModal(): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const seatsText = formState.selectedSeats.join(', ');
  overlay.innerHTML = `
    <div class="modal-content glow-card">
      <div class="modal-icon">🚀</div>
      <h2>Registration Confirmed!</h2>
      <p>Welcome to Tech Spectra — 29th & 30th June 2026</p>
      <p class="modal-seat">Your Seat(s): <strong>${seatsText}</strong></p>
      <p class="modal-email">A confirmation has been sent to ${formState.email}</p>
      <button class="cta-button modal-close-btn">
        <span>Got it!</span>
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    overlay.querySelector('.modal-content')?.classList.add('visible');
  });

  overlay.querySelector('.modal-close-btn')?.addEventListener('click', () => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
      navigate('home');
    }, 300);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.querySelector('.modal-close-btn')?.dispatchEvent(new Event('click'));
    }
  });
}

async function renderForm(): Promise<HTMLElement> {
  const section = document.createElement('section');
  section.className = 'page register-page';

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Register</h1>
    <p>Secure your spot at Tech Spectra 2026</p>
  `;

  const form = document.createElement('form');
  form.className = 'register-form';
  form.id = 'registration-form';
  form.noValidate = true;

  // Personal details section
  const personalSection = document.createElement('div');
  personalSection.className = 'form-section';
  personalSection.innerHTML = `
    <h3>Personal Details</h3>
    <div class="form-group">
      <label for="full-name" id="full-name-label">Full Name <span class="required">*</span></label>
      <input type="text" id="full-name" name="fullName" placeholder="Enter your full name" required />
      <span class="form-error" id="name-error"></span>
    </div>
    <div id="team-members-inputs"></div>
    <div class="form-group">
      <label for="college-name">College / Institution Name <span class="required">*</span></label>
      <input type="text" id="college-name" name="collegeName" placeholder="Enter your college name" required />
      <span class="form-error" id="college-error"></span>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" placeholder="you@college.edu" required />
        <span class="form-error" id="email-error"></span>
      </div>
      <div class="form-group">
        <label for="phone">Phone Number <span class="required">*</span></label>
        <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" required />
        <span class="form-error" id="phone-error"></span>
      </div>
    </div>
  `;

  // ID Card upload
  const uploadSection = document.createElement('div');
  uploadSection.className = 'form-section';
  uploadSection.innerHTML = `
    <h3>College ID Cards <span class="required">*</span></h3>
    <div id="id-cards-upload-container" style="display: flex; flex-direction: column; gap: 20px;"></div>
  `;

  // Event selection
  const eventsSection = document.createElement('div');
  eventsSection.className = 'form-section';
  eventsSection.innerHTML = `
    <h3>Select Competitions to Participate In <span class="required">*</span></h3>
    <div class="events-checkboxes" id="events-checkboxes">
      ${EVENTS.map(
        (event) => `
        <label class="event-checkbox">
          <input type="checkbox" value="${event.name}" />
          <span class="checkbox-indicator"></span>
          <span class="checkbox-label">${event.name}</span>
        </label>
      `,
      ).join('')}
    </div>
    <div id="problems-container"></div>
    <span class="form-error" id="events-error"></span>
  `;

  // Seat grid
  const seatSection = document.createElement('div');
  seatSection.className = 'form-section';
  const seatGridEl = renderSeatGrid();
  const seatError = document.createElement('span');
  seatError.className = 'form-error';
  seatError.id = 'seat-error';
  seatSection.appendChild(seatGridEl);
  seatSection.appendChild(seatError);

  // Registration Type section
  const regTypeSection = document.createElement('div');
  regTypeSection.className = 'form-section';
  regTypeSection.innerHTML = `
    <h3>Registration Type</h3>
    <div class="form-group">
      <div style="display: flex; gap: 20px; margin-top: 10px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="registrationType" value="single" checked style="width: auto; margin: 0;" />
          Single Participant
        </label>
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="registrationType" value="team" style="width: auto; margin: 0;" />
          Team Registration
        </label>
      </div>
    </div>

    <div id="team-details-container" style="display: none; margin-top: 20px;">
      <div class="form-group">
        <label for="team-name">Team Name <span class="required">*</span></label>
        <input type="text" id="team-name" placeholder="Enter your team name" />
        <span class="form-error" id="team-name-error"></span>
      </div>
      <div class="form-group">
        <label for="team-size">Team Size (including lead) <span class="required">*</span></label>
        <select id="team-size" style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-primary); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.25s ease;">
          <option value="2">2 Members</option>
          <option value="3">3 Members</option>
          <option value="4">4 Members</option>
        </select>
      </div>
    </div>
  `;

  // Step Containers
  const step1Container = document.createElement('div');
  step1Container.className = 'form-step step-1';
  step1Container.appendChild(regTypeSection);
  step1Container.appendChild(personalSection);
  step1Container.appendChild(uploadSection);
  step1Container.appendChild(eventsSection);

  const nextSection = document.createElement('div');
  nextSection.className = 'form-section next-section';
  nextSection.style.textAlign = 'center';
  nextSection.innerHTML = `
    <span class="form-error" id="step1-error" style="display: none; margin-bottom: 15px;"></span>
    <button type="button" id="next-btn" class="cta-button">
      <span>Next</span>
    </button>
  `;
  step1Container.appendChild(nextSection);

  const step2Container = document.createElement('div');
  step2Container.className = 'form-step step-2';
  step2Container.style.display = 'none';
  step2Container.appendChild(seatSection);

  const submitSection = document.createElement('div');
  submitSection.className = 'form-section submit-section';
  submitSection.style.cssText = 'display: flex; gap: 16px; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 20px;';
  submitSection.innerHTML = `
    <span class="form-error" id="submit-error" style="display: none; width: 100%; text-align: center; margin-bottom: 15px;"></span>
    <button type="button" id="back-btn" class="cta-button" style="background: transparent; border: 1px solid var(--border-glow); color: var(--text-primary);">
      <span>Back</span>
    </button>
    <button type="submit" id="submit-btn" class="cta-button submit-btn">
      <span>Complete Registration</span>
    </button>
  `;
  step2Container.appendChild(submitSection);

  form.appendChild(step1Container);
  form.appendChild(step2Container);

  section.appendChild(header);
  section.appendChild(form);

  // Dynamic team members generator
  function renderTeamMemberInputs(size: number) {
    const container = form.querySelector('#team-members-inputs');
    if (!container) return;
    container.innerHTML = '';

    formState.teamMembers = [];
    for (let i = 2; i <= size; i++) {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginTop = '15px';
      group.innerHTML = `
        <label for="member-${i}-name">Member ${i} Full Name <span class="required">*</span></label>
        <input type="text" id="member-${i}-name" class="team-member-input" data-index="${i - 2}" placeholder="Enter Member ${i} name" required />
        <span class="form-error" id="member-${i}-error"></span>
      `;
      container.appendChild(group);

      group.querySelector('input')?.addEventListener('input', (e) => {
        const idx = parseInt((e.target as HTMLInputElement).dataset.index!);
        formState.teamMembers[idx] = (e.target as HTMLInputElement).value;
        clearError(`member-${idx + 2}-error`);
      });
    }
  }

  // Dynamic ID Card uploads generator
  function renderIdCardUploads(size: number) {
    const container = form.querySelector('#id-cards-upload-container');
    if (!container) return;
    container.innerHTML = '';

    // Ensure formState.idCards has correct size
    const prevCards = [...formState.idCards];
    formState.idCards = [];
    for (let i = 0; i < size; i++) {
      formState.idCards.push(prevCards[i] || null);
    }

    for (let i = 1; i <= size; i++) {
      const isLead = i === 1;
      const memberName = formState.registrationType === 'team'
        ? (isLead ? 'Lead Member' : `Member ${i}`)
        : 'Participant';

      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginTop = '10px';

      const hasFile = formState.idCards[i - 1] !== null;
      const fileNameText = hasFile ? formState.idCards[i - 1]!.name : '';
      const displayVal = hasFile ? 'block' : 'none';

      group.innerHTML = `
        <label>Upload College ID Card for ${memberName} <span class="required">*</span></label>
        <div class="upload-zone" id="upload-zone-${i}">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1A6BFF" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <p>Drag & drop or click to upload ID card</p>
          <p class="upload-hint">JPG, PNG, PDF (max 5MB)</p>
          <span class="file-name" id="file-name-${i}" style="display: ${displayVal}">${fileNameText}</span>
        </div>
        <input type="file" id="id-card-input-${i}" accept=".jpg,.jpeg,.png,.pdf" hidden />
        <span class="form-error" id="id-card-error-${i}"></span>
      `;
      container.appendChild(group);

      const zone = group.querySelector(`#upload-zone-${i}`) as HTMLElement;
      const input = group.querySelector(`#id-card-input-${i}`) as HTMLInputElement;
      if (zone && input) {
        setupDragDropForMember(i - 1, zone, input);
      }
    }
  }

  // Dynamic problem statement inputs generator
  function renderProblemInputs() {
    const container = form.querySelector('#problems-container');
    if (!container) return;
    container.innerHTML = '';

    const hasHackathon = formState.selectedEvents.includes('Hackathon');
    const hasSharkTank = formState.selectedEvents.includes('Shark Tank');

    if (hasHackathon) {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginTop = '15px';
      group.innerHTML = `
        <label for="hackathon-problem">Hackathon Problem Statement / Project Description <span class="required">*</span></label>
        <textarea id="hackathon-problem" placeholder="Describe the problem you are working on or solving..." rows="3" required style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-primary); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.25s ease; resize: vertical;"></textarea>
        <span class="form-error" id="hackathon-problem-error"></span>
      `;
      container.appendChild(group);

      const textarea = group.querySelector('#hackathon-problem') as HTMLTextAreaElement;
      textarea.value = formState.hackathonProblem;
      textarea.addEventListener('input', (e) => {
        formState.hackathonProblem = (e.target as HTMLTextAreaElement).value;
        clearError('hackathon-problem-error');
      });
    }

    if (hasSharkTank) {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.style.marginTop = '15px';
      group.innerHTML = `
        <label for="shark-tank-problem">Shark Tank Pitch/Problem Idea <span class="required">*</span></label>
        <textarea id="shark-tank-problem" placeholder="Describe the startup idea or problem you are pitching..." rows="3" required style="width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; color: var(--text-primary); font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.25s ease; resize: vertical;"></textarea>
        <span class="form-error" id="shark-tank-problem-error"></span>
      `;
      container.appendChild(group);

      const textarea = group.querySelector('#shark-tank-problem') as HTMLTextAreaElement;
      textarea.value = formState.sharkTankProblem;
      textarea.addEventListener('input', (e) => {
        formState.sharkTankProblem = (e.target as HTMLTextAreaElement).value;
        clearError('shark-tank-problem-error');
      });
    }
  }

  // Registration Type radio toggle listener
  form.querySelectorAll('input[name="registrationType"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value as 'single' | 'team';
      formState.registrationType = type;
      formState.selectedSeats = [];
      const teamContainer = form.querySelector('#team-details-container') as HTMLElement;
      const label = form.querySelector('#full-name-label');

      if (type === 'team') {
        if (label) label.innerHTML = 'Full Name (Lead Member) <span class="required">*</span>';
        teamContainer.style.display = 'block';
        formState.teamSize = parseInt((form.querySelector('#team-size') as HTMLSelectElement).value);
        renderTeamMemberInputs(formState.teamSize);
        renderIdCardUploads(formState.teamSize);
      } else {
        if (label) label.innerHTML = 'Full Name <span class="required">*</span>';
        teamContainer.style.display = 'none';
        formState.teamSize = 1;
        formState.teamMembers = [];
        formState.teamName = '';
        const membersContainer = form.querySelector('#team-members-inputs');
        if (membersContainer) membersContainer.innerHTML = '';
        renderIdCardUploads(1);
      }
    });
  });

  // Team Size change listener
  form.querySelector('#team-size')?.addEventListener('change', (e) => {
    formState.teamSize = parseInt((e.target as HTMLSelectElement).value);
    formState.selectedSeats = [];
    renderTeamMemberInputs(formState.teamSize);
    renderIdCardUploads(formState.teamSize);
  });

  // Team Name input listener
  form.querySelector('#team-name')?.addEventListener('input', (e) => {
    formState.teamName = (e.target as HTMLInputElement).value;
    clearError('team-name-error');
  });

  // Form input listeners
  form.querySelector('#full-name')?.addEventListener('input', (e) => {
    formState.fullName = (e.target as HTMLInputElement).value;
    clearError('name-error');
  });
  form.querySelector('#college-name')?.addEventListener('input', (e) => {
    formState.collegeName = (e.target as HTMLInputElement).value;
    clearError('college-error');
  });
  form.querySelector('#email')?.addEventListener('input', (e) => {
    formState.email = (e.target as HTMLInputElement).value;
    clearError('email-error');
  });
  form.querySelector('#phone')?.addEventListener('input', (e) => {
    formState.phone = (e.target as HTMLInputElement).value;
    clearError('phone-error');
  });

  // Event checkboxes
  form.querySelectorAll('.event-checkbox input').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.checked) {
        formState.selectedEvents.push(input.value);
      } else {
        formState.selectedEvents = formState.selectedEvents.filter(
          (v) => v !== input.value,
        );
      }
      clearError('events-error');
      renderProblemInputs();
    });
  });

  // Next / Back Navigation
  form.querySelector('#next-btn')?.addEventListener('click', () => {
    if (validateStep1()) {
      clearError('step1-error');
      step1Container.style.display = 'none';
      step2Container.style.display = 'block';
      updateSeatUI();
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      showError('step1-error', 'Please fill all required fields and select at least one event.');
    }
  });

  form.querySelector('#back-btn')?.addEventListener('click', () => {
    step2Container.style.display = 'none';
    step1Container.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
  });

  // Submit
  form.addEventListener('submit', handleSubmit);

  // Initial ID Card uploads container render
  renderIdCardUploads(formState.teamSize);

  // Load seats
  loadSeats();

  return section;
}

export async function renderRegister(): Promise<HTMLElement> {
  return await renderForm();
}

export function cleanupRegister(): void {
  formState = {
    registrationType: 'single',
    teamName: '',
    teamSize: 1,
    teamMembers: [],
    fullName: '',
    collegeName: '',
    email: '',
    phone: '',
    idCards: [],
    selectedEvents: [],
    selectedSeats: [],
    hackathonProblem: '',
    sharkTankProblem: '',
  };
  bookedSeats = new Set();
  isSubmitting = false;
}
```

### admin-login.ts

```typescript
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
```

### admin.ts

```typescript
import { getAllRegistrations, deleteRegistration } from '../supabase';
import type { Registration } from '../types';
import { navigate } from '../router';
import { stopParticles, startParticles } from '../particles';

let registrations: Registration[] = [];
let filteredRegistrations: Registration[] = [];
let searchQuery = '';
let currentFilter: 'all' | 'day1' | 'day2' = 'all';
let isLoading = true;
let idCardModalActive = false;

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getEventDay(eventName: string): number {
  const day1Events = ['Prompt War', 'Hackathon', 'Nukkad Natak (Street Play)'];
  return day1Events.includes(eventName) ? 1 : 2;
}

function applyFilters(): void {
  let filtered = registrations;

  // Event day filter
  if (currentFilter === 'day1') {
    filtered = filtered.filter((r) =>
      r.events_selected.some((e) => getEventDay(e) === 1),
    );
  } else if (currentFilter === 'day2') {
    filtered = filtered.filter((r) =>
      r.events_selected.some((e) => getEventDay(e) === 2),
    );
  }

  // Search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.college_name.toLowerCase().includes(q) ||
        r.seat_number.toLowerCase().includes(q) ||
        r.phone.includes(q),
    );
  }

  filteredRegistrations = filtered;
}

function exportCSV(): void {
  const data = filteredRegistrations.length > 0 ? filteredRegistrations : registrations;
  if (data.length === 0) return;

  // CSV escape: wrap in quotes and double-quote any internal quotes
  const esc = (val: string | undefined | null): string => {
    const s = (val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const headers = [
    'S.No',
    'Full Name',
    'College / Institution',
    'Email',
    'Phone',
    'Events Selected',
    'Seat Number',
    'Hackathon Problem',
    'Shark Tank Problem',
    'ID Card URL',
    'Registered At',
  ];

  const rows = data.map((r, i) => [
    String(i + 1),
    esc(r.full_name),
    esc(r.college_name),
    esc(r.email),
    esc(r.phone),
    esc(r.events_selected.join('; ')),
    esc(r.seat_number),
    esc(r.hackathon_problem),
    esc(r.shark_tank_problem),
    esc(r.id_card_url),
    esc(r.registered_at ? new Date(r.registered_at).toISOString() : ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
    '\n',
  );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `tech-spectra-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function showIdCardModal(url: string, name: string): void {
  if (idCardModalActive) return;
  idCardModalActive = true;

  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.innerHTML = `
    <div class="admin-modal-content">
      <button class="admin-modal-close" id="admin-modal-close" aria-label="Close">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <h3 class="admin-modal-title">ID Card — ${name}</h3>
      <div class="admin-modal-img-wrapper">
        <img src="${url}" alt="ID Card for ${name}" class="admin-modal-img" />
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.querySelector('.admin-modal-content')?.classList.add('visible');
  });

  const close = () => {
    idCardModalActive = false;
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('#admin-modal-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function escHandler(ev) {
    if (ev.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function renderTable(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'admin-table-wrapper';

  const table = document.createElement('table');
  table.className = 'admin-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th class="col-sno">#</th>
      <th class="col-name">Full Name</th>
      <th class="col-college">College</th>
      <th class="col-email">Email</th>
      <th class="col-phone">Phone</th>
      <th class="col-events">Events</th>
      <th class="col-seat">Seat</th>
      <th class="col-idcard">ID Card</th>
      <th class="col-problems">Problems</th>
      <th class="col-date">Registered</th>
      <th class="col-actions">Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  if (filteredRegistrations.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'admin-empty-row';
    emptyRow.innerHTML = `
      <td colspan="11">
        <div class="admin-empty-state">
          <span class="admin-empty-icon">📋</span>
          <p>${isLoading ? 'Loading registrations...' : 'No registrations found.'}</p>
        </div>
      </td>
    `;
    tbody.appendChild(emptyRow);
  } else {
    filteredRegistrations.forEach((reg, index) => {
      const row = document.createElement('tr');
      row.className = 'admin-table-row';

      const eventsHtml = reg.events_selected
        .map((e) => `<span class="admin-event-tag event-tag-${e.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}">${e}</span>`)
        .join('');

      const problemsHtml: string[] = [];
      if (reg.hackathon_problem) {
        problemsHtml.push(
          `<div class="admin-problem-item"><span class="admin-problem-label">Hackathon:</span> ${reg.hackathon_problem}</div>`,
        );
      }
      if (reg.shark_tank_problem) {
        problemsHtml.push(
          `<div class="admin-problem-item"><span class="admin-problem-label">Shark Tank:</span> ${reg.shark_tank_problem}</div>`,
        );
      }

      const idCardHtml = reg.id_card_url
        ? `<button class="admin-id-card-btn" data-url="${reg.id_card_url}" data-name="${reg.full_name}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            View ID
          </button>`
        : '<span class="admin-no-id">—</span>';

      row.innerHTML = `
        <td class="col-sno">${index + 1}</td>
        <td class="col-name"><strong>${reg.full_name}</strong></td>
        <td class="col-college">${reg.college_name}</td>
        <td class="col-email"><a href="mailto:${reg.email}" class="admin-email-link">${reg.email}</a></td>
        <td class="col-phone"><a href="tel:${reg.phone}" class="admin-phone-link">${reg.phone}</a></td>
        <td class="col-events">${eventsHtml}</td>
        <td class="col-seat"><span class="admin-seat-badge">${reg.seat_number}</span></td>
        <td class="col-idcard">${idCardHtml}</td>
        <td class="col-problems">${problemsHtml.length > 0 ? problemsHtml.join('') : '<span class="admin-no-id">—</span>'}</td>
        <td class="col-date">${formatDate(reg.registered_at)}</td>
        <td class="col-actions">
          <button class="admin-delete-btn" data-id="${reg.id}" data-name="${reg.full_name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Delete
          </button>
        </td>
      `;

      tbody.appendChild(row);
    });
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);

  // Attach click handlers after DOM is ready
  requestAnimationFrame(() => {
    wrapper.querySelectorAll('.admin-id-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = (btn as HTMLElement).dataset.url!;
        const name = (btn as HTMLElement).dataset.name!;
        showIdCardModal(url, name);
      });
    });

    wrapper.querySelectorAll('.admin-delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = (btn as HTMLElement).dataset.id!;
        const name = (btn as HTMLElement).dataset.name!;

        if (confirm(`Are you sure you want to delete the registration for ${name}?`)) {
          try {
            (btn as HTMLButtonElement).disabled = true;
            (btn as HTMLButtonElement).innerHTML = 'Deleting...';

            await deleteRegistration(id);

            // Reload local data and refresh
            registrations = registrations.filter(r => r.id !== id);
            applyFilters();
            refreshContent();

            // Re-render stats & breakdown if containers exist
            const statsContainerEl = document.getElementById('admin-stats-container');
            if (statsContainerEl) {
              statsContainerEl.innerHTML = '';
              statsContainerEl.appendChild(renderStats());
            }
            const breakdownContainerEl = document.getElementById('admin-breakdown-container');
            if (breakdownContainerEl) {
              breakdownContainerEl.innerHTML = '';
              breakdownContainerEl.appendChild(renderEventsBreakdown());
            }
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete registration');
            (btn as HTMLButtonElement).disabled = false;
            (btn as HTMLButtonElement).innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Delete
            `;
          }
        }
      });
    });
  });

  return wrapper;
}

function renderStats(): HTMLElement {
  const stats = document.createElement('div');
  stats.className = 'admin-stats';

  const total = registrations.length;
  const uniqueEmails = new Set(registrations.map((r) => r.email)).size;
  const seatsBooked = registrations.length;
  const eventsCount: Record<string, number> = {};
  registrations.forEach((r) => {
    r.events_selected.forEach((e) => {
      eventsCount[e] = (eventsCount[e] || 0) + 1;
    });
  });

  stats.innerHTML = `
    <div class="admin-stat-card">
      <div class="admin-stat-icon">👥</div>
      <div class="admin-stat-value">${total}</div>
      <div class="admin-stat-label">Total Registrations</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">📧</div>
      <div class="admin-stat-value">${uniqueEmails}</div>
      <div class="admin-stat-label">Unique Participants</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">💺</div>
      <div class="admin-stat-value">${seatsBooked}</div>
      <div class="admin-stat-label">Seats Booked</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">🏆</div>
      <div class="admin-stat-value">${Object.keys(eventsCount).length}</div>
      <div class="admin-stat-label">Events with Registrations</div>
    </div>
  `;

  return stats;
}

function renderEventsBreakdown(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'admin-events-breakdown';

  const title = document.createElement('h3');
  title.className = 'admin-breakdown-title';
  title.textContent = 'Event-wise Registrations';
  container.appendChild(title);

  const eventsCount: Record<string, number> = {};
  registrations.forEach((r) => {
    r.events_selected.forEach((e) => {
      eventsCount[e] = (eventsCount[e] || 0) + 1;
    });
  });

  const maxCount = Math.max(...Object.values(eventsCount), 1);
  const grid = document.createElement('div');
  grid.className = 'admin-breakdown-grid';

  for (const [event, count] of Object.entries(eventsCount).sort((a, b) => b[1] - a[1])) {
    const pct = (count / maxCount) * 100;
    const card = document.createElement('div');
    card.className = 'admin-breakdown-item';
    card.innerHTML = `
      <div class="admin-breakdown-info">
        <span class="admin-breakdown-name">${event}</span>
        <span class="admin-breakdown-count">${count}</span>
      </div>
      <div class="admin-breakdown-bar-bg">
        <div class="admin-breakdown-bar" style="width: ${pct}%"></div>
      </div>
    `;
    grid.appendChild(card);
  }

  container.appendChild(grid);
  return container;
}

function renderSearchAndFilters(): HTMLElement {
  const controls = document.createElement('div');
  controls.className = 'admin-controls';

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'admin-search-wrapper';

  const searchIcon = document.createElement('span');
  searchIcon.className = 'admin-search-icon';
  searchIcon.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  `;

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'admin-search-input';
  searchInput.placeholder = 'Search by name, email, college, seat, phone...';
  searchInput.value = searchQuery;

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);

  const filterGroup = document.createElement('div');
  filterGroup.className = 'admin-filter-group';

  const filters: { value: typeof currentFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'day1', label: 'Day 1 Events' },
    { value: 'day2', label: 'Day 2 Events' },
  ];

  filters.forEach((f) => {
    const btn = document.createElement('button');
    btn.className = `admin-filter-btn${currentFilter === f.value ? ' active' : ''}`;
    btn.textContent = f.label;
    btn.dataset.filter = f.value;
    btn.addEventListener('click', () => {
      currentFilter = f.value;
      searchQuery = searchInput.value;
      applyFilters();
      refreshContent();
    });
    filterGroup.appendChild(btn);
  });

  controls.appendChild(searchWrapper);
  controls.appendChild(filterGroup);

  // Debounced search
  let searchTimer: ReturnType<typeof setTimeout>;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      applyFilters();
      refreshContent();
    }, 250);
  });

  return controls;
}

function refreshContent(): void {
  const contentArea = document.getElementById('admin-content-area');
  if (!contentArea) return;

  contentArea.innerHTML = '';

  if (!isLoading) {
    const resultsInfo = document.createElement('div');
    resultsInfo.className = 'admin-results-info';
    const showing = filteredRegistrations.length;
    const total = registrations.length;
    resultsInfo.textContent = `Showing ${showing} of ${total} registration${total !== 1 ? 's' : ''}`;
    contentArea.appendChild(resultsInfo);
  }

  contentArea.appendChild(renderTable());
}

async function loadData(): Promise<void> {
  isLoading = true;
  try {
    const authenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (!authenticated) {
      navigate('admin-login');
      return;
    }

    registrations = await getAllRegistrations();
    applyFilters();
  } catch (err) {
    console.error('Failed to load registrations:', err);
    registrations = [];
    filteredRegistrations = [];
  } finally {
    isLoading = false;
    refreshContent();
  }
}

export async function renderAdmin(): Promise<HTMLElement> {
  // Stop particle animation to improve performance on admin page
  stopParticles();
  const authenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  if (!authenticated) {
    navigate('admin-login');
    return document.createElement('div');
  }

  const section = document.createElement('section');
  section.className = 'page admin-page';

  // Header
  const header = document.createElement('div');
  header.className = 'admin-header';
  header.innerHTML = `
    <div class="admin-header-title">
      <h1>Admin Dashboard</h1>
      <p>Manage and view all Tech Spectra registrations</p>
    </div>
  `;
  section.appendChild(header);

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'admin-toolbar';
  toolbar.innerHTML = `
    <div class="admin-toolbar-left">
      <button id="admin-export-btn" class="admin-toolbar-btn" aria-label="Export CSV">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Export CSV
      </button>
      <button id="admin-refresh-btn" class="admin-toolbar-btn" aria-label="Refresh data">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
        </svg>
        Refresh
      </button>
    </div>
    <div class="admin-toolbar-right">
      <button id="admin-logout-btn" class="admin-toolbar-btn admin-logout-btn" aria-label="Logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Logout
      </button>
    </div>
  `;
  section.appendChild(toolbar);

  // Stats
  const statsContainer = document.createElement('div');
  statsContainer.id = 'admin-stats-container';
  section.appendChild(statsContainer);

  // Events breakdown
  const breakdownContainer = document.createElement('div');
  breakdownContainer.id = 'admin-breakdown-container';
  section.appendChild(breakdownContainer);

  // Controls (search + filters)
  section.appendChild(renderSearchAndFilters());

  // Content area
  const contentArea = document.createElement('div');
  contentArea.id = 'admin-content-area';
  contentArea.className = 'admin-content-area';
  section.appendChild(contentArea);

  // --- Event Listeners ---

  // Export CSV button
  section.querySelector('#admin-export-btn')?.addEventListener('click', exportCSV);

  // Refresh button
  section.querySelector('#admin-refresh-btn')?.addEventListener('click', async () => {
    isLoading = true;
    const contentAreaEl = document.getElementById('admin-content-area');
    if (contentAreaEl) {
      contentAreaEl.innerHTML =
        '<div class="admin-loading"><div class="admin-spinner"></div><p>Refreshing data...</p></div>';
    }
    await loadData();
  });

  // Logout button
  section.querySelector('#admin-logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    navigate('admin-login');
  });

  // Load data
  const loadingEl = document.createElement('div');
  loadingEl.className = 'admin-loading';
  loadingEl.innerHTML = '<div class="admin-spinner"></div><p>Loading registrations...</p>';
  contentArea.appendChild(loadingEl);

  await loadData();

  // Render stats and breakdown after data loads
  if (!isLoading) {
    const statsContainerEl = document.getElementById('admin-stats-container');
    if (statsContainerEl) {
      statsContainerEl.innerHTML = '';
      statsContainerEl.appendChild(renderStats());
    }
    const breakdownContainerEl = document.getElementById('admin-breakdown-container');
    if (breakdownContainerEl) {
      breakdownContainerEl.innerHTML = '';
      breakdownContainerEl.appendChild(renderEventsBreakdown());
    }
  }

  return section;
}

export function cleanupAdmin(): void {
  registrations = [];
  filteredRegistrations = [];
  searchQuery = '';
  currentFilter = 'all';
  isLoading = true;
  idCardModalActive = false;

  // Restart particle animation when leaving admin page
  const app = document.getElementById('app');
  if (app) {
    startParticles(document.body);
  }
}
```

---

## Styles

### style.css

The CSS file (~16KB) defines the complete design system for the website. Key sections include:

- **Design System Variables**: Colors (black background, blue accent `#1a6bff`), fonts (Plus Jakarta Sans), spacing, shadows
- **Reset & Base**: Box-sizing reset, smooth scrolling, font rendering
- **Custom Scrollbar**: Blue-themed scrollbar styling
- **Navbar**: Fixed top navigation with transparent-to-scrolled transition, backdrop blur, mobile hamburger menu
- **Hero Section**: Full-viewport hero with sequential text reveal animations, scrolling indicator
- **CTA Button**: Glowing blue button with pulse animation on homepage
- **Glow Cards**: Cards with blue border glow, subtle hover effects
- **Wallet Cards**: Interactive expandable cards for event preview on homepage
- **Events Full Page**: Grid layout for detailed event cards
- **Schedule Page**: Two-column timeline layout with animated dots and items
- **Registration Form**: Multi-step form with styled inputs, checkboxes, drag-and-drop upload zones, seat grid
- **Seat Grid**: 5×20 grid (100 seats) with available/selected/booked states
- **Success Modal**: Animated overlay modal for registration confirmation
- **Footer**: Two-column layout with branding and college info
- **Admin Login**: Centered password form with show/hide toggle
- **Admin Dashboard**: Stats cards, event breakdown bars, searchable/filterable data table with ID card modals and delete functionality
- **Scroll Reveal**: Intersection Observer-based fade-in-up animations
- **Responsive Breakpoints**: 1024px, 768px, 480px with comprehensive mobile adaptations

---

## Database Setup

### supabase-setup.sql

```sql
-- =========================================================
-- TECH SPECTRA - Supabase Database Setup
-- =========================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- 1. Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_card_url TEXT NOT NULL,
  events_selected TEXT[] NOT NULL,
  seat_number TEXT NOT NULL UNIQUE,
  hackathon_problem TEXT,
  shark_tank_problem TEXT,
  registered_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous inserts (public registration form)
CREATE POLICY "Allow anonymous inserts"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Allow anonymous selects (for checking seat availability)
CREATE POLICY "Allow anonymous selects"
  ON registrations
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous deletes (for admin dashboard management)
CREATE POLICY "Allow anonymous deletes"
  ON registrations
  FOR DELETE
  TO anon
  USING (true);

-- 5. Create index on seat_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_registrations_seat
  ON registrations (seat_number);

-- 6. Create index on email for dedup checks
CREATE INDEX IF NOT EXISTS idx_registrations_email
  ON registrations (email);

-- =========================================================
-- STORAGE: Create id-cards bucket
-- =========================================================
-- Run this part separately in:
-- Dashboard > Storage > Create bucket
-- Bucket name: id-cards
-- Make it public (for public URL access)

-- Then run this to set the bucket policy:
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to id-cards bucket
CREATE POLICY "Allow anonymous uploads"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'id-cards');

-- Allow anonymous reads from id-cards bucket
CREATE POLICY "Allow anonymous reads"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'id-cards');
```

---

## Environment Variables Required

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key |
| `VITE_ADMIN_PASSWORD` | Password for admin dashboard access |

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
