import { getAllRegistrations, deleteRegistration, getAllTeams, deleteTeam } from '../supabase';
import type { TeamMember } from '../types';
import { navigate } from '../router';
import { stopParticles, startParticles } from '../particles';

type FilterType =
  | 'all'
  | 'day1'
  | 'day2'
  | 'Prompt War'
  | 'Hackathon'
  | 'Nukkad Natak (Street Play)'
  | 'Short Movie'
  | 'Shark Tank'
  | 'Instrumental Singing'
  | 'Audience';

interface AdminRow {
  type: 'single' | 'team';
  id: string;
  display_name: string;
  college_name: string;
  email: string;
  phone: string;
  events_selected: string[];
  seat_number: string;
  id_card_url: string;
  registered_at?: string;
  hackathon_problem?: string;
  shark_tank_problem?: string;
  team_name?: string;
  leader_name?: string;
  members?: TeamMember[];
}

let allRows: AdminRow[] = [];
let filteredRows: AdminRow[] = [];
let searchQuery = '';
let currentFilter: FilterType = 'all';
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
  let filtered = allRows;

  // Event day or specific competition/audience filter
  if (currentFilter === 'day1') {
    filtered = filtered.filter((r) =>
      r.events_selected.some((e) => getEventDay(e) === 1),
    );
  } else if (currentFilter === 'day2') {
    filtered = filtered.filter((r) =>
      r.events_selected.some((e) => getEventDay(e) === 2),
    );
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter((r) =>
      r.events_selected.includes(currentFilter),
    );
  }

  // Search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((r) => {
      if (r.type === 'single') {
        return (
          r.display_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.college_name.toLowerCase().includes(q) ||
          r.seat_number.toLowerCase().includes(q) ||
          r.phone.includes(q)
        );
      } else {
        const membersMatch = r.members?.some((m) =>
          m.member_name.toLowerCase().includes(q) ||
          m.seat_number.toLowerCase().includes(q)
        );
        return (
          r.team_name?.toLowerCase().includes(q) ||
          r.leader_name?.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.college_name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          !!membersMatch
        );
      }
    });
  }

  filteredRows = filtered;
}

function exportCSV(): void {
  const data = filteredRows;
  if (data.length === 0) {
    alert('No registrations found for the current filter to export.');
    return;
  }

  // CSV escape: wrap in quotes and double-quote any internal quotes
  const esc = (val: string | undefined | null): string => {
    const s = (val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const headers = [
    'S.No',
    'Registration Type',
    'Full Name / Team Name',
    'Leader Name',
    'College / Institution',
    'Email',
    'Phone',
    'Events Selected',
    'Seats Booked',
    'Team Members Detail',
    'Hackathon Problem',
    'Shark Tank Problem',
    'Registered At',
  ];

  const rows = data.map((r, i) => {
    let typeStr = r.type === 'single' ? 'Single' : 'Team';
    let nameStr = r.type === 'single' ? r.display_name : r.team_name;
    let leaderStr = r.type === 'single' ? 'N/A' : r.leader_name;
    let seatsStr = r.type === 'single' ? r.seat_number : r.members?.map(m => m.seat_number).join('; ');
    let membersStr = '';
    if (r.type === 'team') {
      membersStr = r.members?.map(m => `${m.member_name} (${m.seat_number})`).join('; ') ?? '';
    }

    return [
      String(i + 1),
      esc(typeStr),
      esc(nameStr),
      esc(leaderStr),
      esc(r.college_name),
      esc(r.email),
      esc(r.phone),
      esc(r.events_selected.join('; ')),
      esc(seatsStr),
      esc(membersStr),
      esc(r.hackathon_problem),
      esc(r.shark_tank_problem),
      esc(r.registered_at ? new Date(r.registered_at).toISOString() : ''),
    ];
  });

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

function showDeleteConfirmModal(name: string, onConfirm: () => void): void {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay delete-confirm-overlay';
  overlay.innerHTML = `
    <div class="admin-modal-content delete-confirm-content">
      <h3 class="admin-modal-title">Confirm Deletion</h3>
      <p class="admin-confirm-text">Are you sure you want to delete the registration for <strong>${name}</strong>? This action cannot be undone.</p>
      <div class="admin-modal-actions">
        <button class="admin-modal-btn admin-btn-secondary" id="admin-confirm-cancel">Cancel</button>
        <button class="admin-modal-btn admin-btn-danger" id="admin-confirm-ok">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.querySelector('.admin-modal-content')?.classList.add('visible');
  });

  const close = () => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('#admin-confirm-cancel')?.addEventListener('click', close);
  overlay.querySelector('#admin-confirm-ok')?.addEventListener('click', () => {
    close();
    onConfirm();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
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
      <th class="col-team">Team Details</th>
      <th class="col-college">College</th>
      <th class="col-email">Email</th>
      <th class="col-phone">Phone</th>
      <th class="col-events">Events</th>
      <th class="col-seat">Seat(s)</th>
      <th class="col-idcard">ID Card</th>
      <th class="col-problems">Problems</th>
      <th class="col-date">Registered</th>
      <th class="col-actions">Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  if (filteredRows.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'admin-empty-row';
    emptyRow.innerHTML = `
      <td colspan="12">
        <div class="admin-empty-state">
          <span class="admin-empty-icon">📋</span>
          <p>${isLoading ? 'Loading registrations...' : 'No registrations found.'}</p>
        </div>
      </td>
    `;
    tbody.appendChild(emptyRow);
  } else {
    filteredRows.forEach((reg, index) => {
      const row = document.createElement('tr');
      row.className = 'admin-table-row';

      let displayName = reg.display_name;
      let teamHtml = '<span class="admin-no-id">—</span>';
      let idCardHtml = '<span class="admin-no-id">—</span>';
      let seatBadgeHtml = '';

      if (reg.type === 'single') {
        seatBadgeHtml = `<span class="admin-seat-badge">${reg.seat_number}</span>`;
        if (reg.id_card_url) {
          idCardHtml = `<button class="admin-id-card-btn" data-url="${reg.id_card_url}" data-name="${displayName}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              View ID
            </button>`;
        }
      } else {
        displayName = `Leader: ${reg.leader_name}`;
        teamHtml = `
          <div class="admin-team-badge">Team: ${reg.team_name}</div>
          <div class="admin-team-members">
            ${reg.members?.map(m => `<div>${m.member_name} (${m.seat_number})</div>`).join('')}
          </div>
        `;
        seatBadgeHtml = (reg.members ?? [])
          .map(m => `<span class="admin-seat-badge" style="margin: 2px;">${m.seat_number}</span>`)
          .join(' ');
        
        idCardHtml = `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${reg.members?.map(m => `
              <button class="admin-id-card-btn" data-url="${m.id_card_url}" data-name="${m.member_name}" style="padding: 2px 6px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                ID: ${m.member_name}
              </button>
            `).join('')}
          </div>
        `;
      }

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

      row.innerHTML = `
        <td class="col-sno">${index + 1}</td>
        <td class="col-name"><strong>${displayName}</strong></td>
        <td class="col-team">${teamHtml}</td>
        <td class="col-college">${reg.college_name}</td>
        <td class="col-email"><a href="mailto:${reg.email}" class="admin-email-link">${reg.email}</a></td>
        <td class="col-phone"><a href="tel:${reg.phone}" class="admin-phone-link">${reg.phone}</a></td>
        <td class="col-events">${eventsHtml}</td>
        <td class="col-seat">${seatBadgeHtml}</td>
        <td class="col-idcard">${idCardHtml}</td>
        <td class="col-problems">${problemsHtml.length > 0 ? problemsHtml.join('') : '<span class="admin-no-id">—</span>'}</td>
        <td class="col-date">${formatDate(reg.registered_at)}</td>
        <td class="col-actions">
          <button class="admin-delete-btn" data-id="${reg.id}" data-type="${reg.type}" data-name="${reg.type === 'single' ? displayName : reg.team_name}">
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

  // Event delegation on the wrapper — handles clicks on dynamically created buttons
  wrapper.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;

    // Delete button handler
    const deleteBtn = target.closest('.admin-delete-btn') as HTMLElement | null;
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = deleteBtn.dataset.id;
      const name = deleteBtn.dataset.name;
      const type = deleteBtn.dataset.type as 'single' | 'team';

      if (!id || !name) return;

      showDeleteConfirmModal(name, async () => {
        try {
          const btn = deleteBtn as HTMLButtonElement;
          btn.disabled = true;
          btn.innerHTML = 'Deleting...';

          if (type === 'team') {
            await deleteTeam(id);
            allRows = allRows.filter(r => !(r.type === 'team' && r.id === id));
          } else {
            await deleteRegistration(id);
            allRows = allRows.filter(r => !(r.type === 'single' && r.id === id));
          }

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
          console.error('Error during deletion process:', err);
          alert(err instanceof Error ? err.message : 'Failed to delete registration');
          const btn = deleteBtn as HTMLButtonElement;
          btn.disabled = false;
          btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Delete
          `;
        }
      });
      return;
    }

    // ID Card button handler
    const idCardBtn = target.closest('.admin-id-card-btn') as HTMLElement | null;
    if (idCardBtn) {
      e.preventDefault();
      const url = idCardBtn.dataset.url;
      const cardName = idCardBtn.dataset.name;
      if (url && cardName) {
        showIdCardModal(url, cardName);
      }
      return;
    }
  });

  return wrapper;
}

function renderStats(): HTMLElement {
  const stats = document.createElement('div');
  stats.className = 'admin-stats';

  const totalSingles = allRows.filter(r => r.type === 'single').length;
  const totalTeams = allRows.filter(r => r.type === 'team').length;
  const totalParticipants = allRows.reduce((acc, r) => acc + (r.type === 'team' ? (r.members?.length ?? 0) : 1), 0);
  const uniqueEmails = new Set(allRows.map((r) => r.email)).size;
  const seatsBooked = totalParticipants;

  stats.innerHTML = `
    <div class="admin-stat-card">
      <div class="admin-stat-icon">👥</div>
      <div class="admin-stat-value">${totalSingles + totalTeams}</div>
      <div class="admin-stat-label">Total Groups (${totalSingles} S / ${totalTeams} T)</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">📧</div>
      <div class="admin-stat-value">${uniqueEmails}</div>
      <div class="admin-stat-label">Unique Email IDs</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">💺</div>
      <div class="admin-stat-value">${seatsBooked}</div>
      <div class="admin-stat-label">Total Seats Booked</div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">🏆</div>
      <div class="admin-stat-value">${totalParticipants}</div>
      <div class="admin-stat-label">Total Participants</div>
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
  allRows.forEach((r) => {
    const count = r.type === 'team' ? (r.members?.length ?? 0) : 1;
    r.events_selected.forEach((e) => {
      eventsCount[e] = (eventsCount[e] || 0) + count;
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
  filterGroup.style.display = 'flex';
  filterGroup.style.alignItems = 'center';
  filterGroup.style.gap = '10px';

  const filterSelect = document.createElement('select');
  filterSelect.id = 'admin-filter-select';
  filterSelect.className = 'admin-filter-select';
  filterSelect.style.cssText = `
    background: rgba(10, 10, 10, 0.8);
    border: 1px solid var(--border-glow);
    border-radius: 8px;
    color: var(--text-primary);
    padding: 10px 15px;
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-glow);
  `;

  const options: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Registrations' },
    { value: 'day1', label: 'Day 1 Events' },
    { value: 'day2', label: 'Day 2 Events' },
    { value: 'Prompt War', label: 'Prompt War' },
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'Nukkad Natak (Street Play)', label: 'Nukkad Natak (Street Play)' },
    { value: 'Short Movie', label: 'Short Movie' },
    { value: 'Shark Tank', label: 'Shark Tank' },
    { value: 'Instrumental Singing', label: 'Instrumental Singing' },
    { value: 'Audience', label: 'Audience Spectators' }
  ];

  options.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    optionEl.selected = currentFilter === opt.value;
    optionEl.style.background = '#0a0a0a';
    optionEl.style.color = '#ffffff';
    filterSelect.appendChild(optionEl);
  });

  filterSelect.addEventListener('change', (e) => {
    currentFilter = (e.target as HTMLSelectElement).value as FilterType;
    searchQuery = searchInput.value;
    applyFilters();
    refreshContent();
  });

  filterGroup.appendChild(filterSelect);

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
    const showing = filteredRows.length;
    const total = allRows.length;
    resultsInfo.textContent = `Showing ${showing} of ${total} record${total !== 1 ? 's' : ''}`;
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

    const [regs, teams] = await Promise.all([
      getAllRegistrations(),
      getAllTeams(),
    ]);

    const mappedRegs: AdminRow[] = regs.map((r) => ({
      type: 'single',
      id: r.id!,
      display_name: r.full_name,
      college_name: r.college_name,
      email: r.email,
      phone: r.phone,
      events_selected: r.events_selected,
      seat_number: r.seat_number,
      id_card_url: r.id_card_url,
      registered_at: r.registered_at,
      hackathon_problem: r.hackathon_problem,
      shark_tank_problem: r.shark_tank_problem,
    }));

    const mappedTeams: AdminRow[] = teams.map((t) => ({
      type: 'team',
      id: t.id!,
      display_name: `Team: ${t.team_name} (Leader: ${t.leader_name})`,
      college_name: t.college_name,
      email: t.leader_email,
      phone: t.leader_phone,
      events_selected: t.events_selected,
      seat_number: t.members?.map(m => m.seat_number).join(', ') ?? '',
      id_card_url: t.members?.[0]?.id_card_url ?? '',
      registered_at: t.registered_at,
      hackathon_problem: t.hackathon_problem,
      shark_tank_problem: t.shark_tank_problem,
      team_name: t.team_name,
      leader_name: t.leader_name,
      members: t.members,
    }));

    allRows = [...mappedRegs, ...mappedTeams].sort((a, b) => {
      const dateA = a.registered_at ? new Date(a.registered_at).getTime() : 0;
      const dateB = b.registered_at ? new Date(b.registered_at).getTime() : 0;
      return dateB - dateA;
    });

    applyFilters();
  } catch (err) {
    console.error('Failed to load data:', err);
    allRows = [];
    filteredRows = [];
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
  allRows = [];
  filteredRows = [];
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
