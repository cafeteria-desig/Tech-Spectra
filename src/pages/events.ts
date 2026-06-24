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
