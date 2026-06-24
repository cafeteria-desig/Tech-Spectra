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
      <p class="hero-date">29–30 June 2026</p>
      <p class="hero-organised">Organised by <strong>Lachoo Memorial College of Science &amp; Technology</strong></p>
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
    hero.querySelector('.hero-organised')?.classList.add('reveal-active');
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
