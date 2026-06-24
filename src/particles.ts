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
