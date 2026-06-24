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
