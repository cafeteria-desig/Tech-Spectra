import {
  getBookedSeats,
  uploadIdCard,
  checkSeatAvailability,
  submitRegistration,
  supabase,
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
}  async function loadSeats(): Promise<void> {
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

    // Submit registration
    if (formState.registrationType === 'single') {
      await submitRegistration({
        full_name: formState.fullName.trim(),
        college_name: formState.collegeName.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        id_card_url: idCardUrls[0],
        events_selected: formState.selectedEvents,
        seat_number: formState.selectedSeats[0],
        hackathon_problem: formState.selectedEvents.includes('Hackathon') ? formState.hackathonProblem.trim() : undefined,
        shark_tank_problem: formState.selectedEvents.includes('Shark Tank') ? formState.sharkTankProblem.trim() : undefined,
      });
    } else {
      // 1. Insert into teams table
      const teamPayload = {
        team_name: formState.teamName.trim(),
        leader_name: formState.fullName.trim(),
        leader_email: formState.email.trim(),
        leader_phone: formState.phone.trim(),
        college_name: formState.collegeName.trim(),
        events_selected: formState.selectedEvents,
        hackathon_problem: formState.selectedEvents.includes('Hackathon') ? formState.hackathonProblem.trim() : undefined,
        shark_tank_problem: formState.selectedEvents.includes('Shark Tank') ? formState.sharkTankProblem.trim() : undefined,
      };

      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([teamPayload])
        .select('id')
        .single();

      if (teamError) throw teamError;
      if (!teamData) throw new Error('Failed to create team record.');

      const teamId = teamData.id;

      // 2. Insert members into team_members table
      try {
        const memberPayloads = [];

        // Leader is member 1
        memberPayloads.push({
          team_id: teamId,
          member_name: formState.fullName.trim(),
          member_email: formState.email.trim(),
          id_card_url: idCardUrls[0],
          seat_number: formState.selectedSeats[0],
        });

        // Other members
        for (let i = 2; i <= formState.teamSize; i++) {
          memberPayloads.push({
            team_id: teamId,
            member_name: (formState.teamMembers[i - 2] || '').trim(),
            member_email: formState.email.trim(),
            id_card_url: idCardUrls[i - 1],
            seat_number: formState.selectedSeats[i - 1],
          });
        }

        const { error: membersError } = await supabase
          .from('team_members')
          .insert(memberPayloads);

        if (membersError) throw membersError;
      } catch (insertError) {
        // Rollback: delete the team (which cascades to team_members)
        await supabase.from('teams').delete().eq('id', teamId);
        throw insertError;
      }
    }

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
      
      <div style="margin: 15px 0; padding: 12px; background: rgba(26, 107, 255, 0.05); border: 1px solid var(--border-glow); border-radius: 8px; text-align: center;">
        <p style="color: var(--text-primary); font-weight: 600; margin: 0 0 6px 0; font-size: 0.95rem;">⚠️ Please Remember your Seat Number!</p>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0; line-height: 1.4;">You must positively bring your college ID card with you on the days of the events.</p>
      </div>
      
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
    
    <div class="audience-divider" style="margin: 20px 0; text-align: center; position: relative;">
      <span style="background: #0a0a0a; padding: 0 15px; color: var(--text-secondary); font-size: 0.9rem; position: relative; z-index: 1;">OR</span>
      <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border-subtle); z-index: 0;"></div>
    </div>
    
    <div class="audience-section" style="text-align: center;">
      <button type="button" id="audience-btn" class="cta-button" style="background: transparent; border: 1px solid var(--border-glow); color: var(--text-primary); padding: 10px 20px; font-size: 0.95rem; width: 100%; max-width: 300px; margin: 0 auto; display: block; transition: all 0.3s ease;">
        <span>Register as Audience</span>
      </button>
      <p id="audience-note" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px; display: none;">You are registering as an audience member. Competition entries are disabled.</p>
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
  const audienceBtn = eventsSection.querySelector('#audience-btn') as HTMLButtonElement;
  const audienceNote = eventsSection.querySelector('#audience-note') as HTMLElement;
  const checkboxes = eventsSection.querySelectorAll('.event-checkbox input') as NodeListOf<HTMLInputElement>;

  const updateAudienceUI = () => {
    const isAudience = formState.selectedEvents.includes('Audience');
    if (isAudience) {
      if (audienceBtn) {
        audienceBtn.innerHTML = '<span>Switch to Competitions</span>';
        audienceBtn.style.background = 'rgba(26, 107, 255, 0.15)';
        audienceBtn.style.borderColor = 'var(--border-glow)';
        audienceBtn.style.boxShadow = '0 0 15px rgba(26, 107, 255, 0.2)';
      }
      if (audienceNote) audienceNote.style.display = 'block';
      
      checkboxes.forEach((cb) => {
        cb.checked = false;
        cb.disabled = true;
        const parentLabel = cb.closest('.event-checkbox') as HTMLElement;
        if (parentLabel) {
          parentLabel.classList.add('disabled');
          parentLabel.style.opacity = '0.5';
          parentLabel.style.cursor = 'not-allowed';
        }
      });
    } else {
      if (audienceBtn) {
        audienceBtn.innerHTML = '<span>Register as Audience</span>';
        audienceBtn.style.background = 'transparent';
        audienceBtn.style.borderColor = 'var(--border-glow)';
        audienceBtn.style.boxShadow = 'none';
      }
      if (audienceNote) audienceNote.style.display = 'none';
      
      checkboxes.forEach((cb) => {
        cb.disabled = false;
        const parentLabel = cb.closest('.event-checkbox') as HTMLElement;
        if (parentLabel) {
          parentLabel.classList.remove('disabled');
          parentLabel.style.opacity = '1';
          parentLabel.style.cursor = 'pointer';
        }
        cb.checked = formState.selectedEvents.includes(cb.value);
      });
    }
    renderProblemInputs();
  };

  audienceBtn?.addEventListener('click', () => {
    const isAudience = formState.selectedEvents.includes('Audience');
    if (isAudience) {
      formState.selectedEvents = [];
    } else {
      formState.selectedEvents = ['Audience'];
      clearError('events-error');
    }
    updateAudienceUI();
  });

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

  // Initialize audience registration UI state
  updateAudienceUI();

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
