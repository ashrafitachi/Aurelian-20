/* ==========================================================================
   State & LocalStorage Setup for Aurelian-20 Batch Portal
   ========================================================================== */

let isAdmin = false;

// Initial Default Portal Content
const defaultData = {
  notices: [
    {
      id: 1,
      title: "Course Final Examination Schedule",
      category: "Exams",
      date: "Oct 24, 2026",
      content: "The upcoming semester final exams will commence on November 15. The detailed course-wise seat plan will be published shortly."
    },
    {
      id: 2,
      title: "Prose Assignment Submission Deadline",
      category: "Assignments",
      date: "Oct 20, 2026",
      content: "Please submit hard copies of your critical essays on Edward Said's Orientalism to the departmental office by Thursday."
    }
  ],
  materials: [
    {
      id: 1,
      title: "An Introduction to Literary Theory Notes",
      course: "Criticism",
      date: "Oct 18, 2026",
      link: "https://drive.google.com"
    },
    {
      id: 2,
      title: "Romantic Poetry Lecture Slides & Annotations",
      course: "Poetry",
      date: "Oct 12, 2026",
      link: "https://drive.google.com"
    }
  ],
  events: [
    {
      id: 1,
      title: "Annual Cultural Program & Reunion",
      date: "Nov 05, 2026",
      location: "RC Majumdar Auditorium, DU"
    },
    {
      id: 2,
      title: "Guest Lecture on Contemporary Post-Colonial Literature",
      date: "Nov 18, 2026",
      location: "Room 302, Arts Building"
    }
  ],
  polls: [
    {
      id: 1,
      question: "Preferred day for the upcoming batch study tour?",
      options: [
        { text: "Friday, Nov 20", votes: 24 },
        { text: "Saturday, Nov 21", votes: 15 },
        { text: "Next Month", votes: 8 }
      ]
    }
  ]
};

// Initialize State from LocalStorage or Load Default Data
let notices = JSON.parse(localStorage.getItem('aurelian_notices')) || defaultData.notices;
let materials = JSON.parse(localStorage.getItem('aurelian_materials')) || defaultData.materials;
let events = JSON.parse(localStorage.getItem('aurelian_events')) || defaultData.events;
let polls = JSON.parse(localStorage.getItem('aurelian_polls')) || defaultData.polls;

function saveData() {
  localStorage.setItem('aurelian_notices', JSON.stringify(notices));
  localStorage.setItem('aurelian_materials', JSON.stringify(materials));
  localStorage.setItem('aurelian_events', JSON.stringify(events));
  localStorage.setItem('aurelian_polls', JSON.stringify(polls));
}

/* ==========================================================================
   Admin Mode Authentication
   ========================================================================== */

document.getElementById('adminToggleBtn').addEventListener('click', () => {
  if (isAdmin) {
    toggleAdminMode(false);
  } else {
    openModal('loginModal');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  toggleAdminMode(false);
});

function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('adminPasswordInput').value;
  
  // Simple front-end password authentication
  if (password === 'du2026' || password === 'aurelian') {
    toggleAdminMode(true);
    closeModal('loginModal');
    document.getElementById('adminPasswordInput').value = '';
  } else {
    alert('Incorrect password! Try "aurelian" or "du2026".');
  }
}

function toggleAdminMode(status) {
  isAdmin = status;
  const banner = document.getElementById('adminBanner');
  const adminBtnText = document.getElementById('adminBtnText');
  const adminElements = document.querySelectorAll('.admin-only');

  if (isAdmin) {
    banner.classList.remove('hidden');
    adminBtnText.textContent = 'Admin Active';
    adminElements.forEach(el => el.classList.remove('hidden'));
  } else {
    banner.classList.add('hidden');
    adminBtnText.textContent = 'Admin Login';
    adminElements.forEach(el => el.classList.add('hidden'));
  }

  // Re-render components to display/hide delete controls
  renderNotices();
  renderMaterials();
  renderEvents();
  renderPolls();
}

/* ==========================================================================
   Rendering Functions
   ========================================================================== */

function renderNotices(filter = 'all') {
  const container = document.getElementById('noticesList');
  container.innerHTML = '';

  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="card-meta">No notices found for this category.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <span class="card-tag">${item.category}</span>
        <h3>${item.title}</h3>
        <p class="card-meta">${item.date}</p>
        <p class="card-content">${item.content}</p>
      </div>
      ${isAdmin ? `
        <div class="card-actions">
          <button class="btn-delete" onclick="deleteItem('notices', ${item.id})">Delete Notice</button>
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

function renderMaterials(filter = 'all') {
  const container = document.getElementById('materialsList');
  container.innerHTML = '';

  const filtered = filter === 'all' ? materials : materials.filter(m => m.course === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="card-meta">No materials found for this course.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <span class="card-tag">${item.course}</span>
        <h3>${item.title}</h3>
        <p class="card-meta">Added: ${item.date}</p>
      </div>
      <div class="card-actions">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
          <i data-lucide="download" class="icon-sm"></i> Open / Download Link
        </a>
        ${isAdmin ? `<button class="btn-delete" onclick="deleteItem('materials', ${item.id})">Delete</button>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function renderEvents() {
  const container = document.getElementById('eventsList');
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML = `<p class="card-meta">No upcoming events listed.</p>`;
    return;
  }

  events.forEach(item => {
    const row = document.createElement('div');
    row.className = 'event-row';
    row.innerHTML = `
      <div class="event-date-badge">${item.date}</div>
      <div class="event-details">
        <h3>${item.title}</h3>
        <p class="card-meta"><i data-lucide="map-pin" class="icon-sm"></i> ${item.location}</p>
      </div>
      ${isAdmin ? `<button class="btn-delete" onclick="deleteItem('events', ${item.id})">Delete Event</button>` : ''}
    `;
    container.appendChild(row);
  });
  lucide.createIcons();
}

function renderPolls() {
  const container = document.getElementById('pollsList');
  container.innerHTML = '';

  if (polls.length === 0) {
    container.innerHTML = `<p class="card-meta">No active polls.</p>`;
    return;
  }

  polls.forEach(poll => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    
    const card = document.createElement('div');
    card.className = 'card';
    
    let optionsHTML = '';
    poll.options.forEach((opt, idx) => {
      const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
      optionsHTML += `
        <button class="poll-option-btn" onclick="votePoll(${poll.id}, ${idx})">
          <div class="poll-bar" style="width: ${percentage}%"></div>
          <div class="poll-text">
            <span>${opt.text}</span>
            <span>${percentage}% (${opt.votes})</span>
          </div>
        </button>
      `;
    });

    card.innerHTML = `
      <div>
        <h3>${poll.question}</h3>
        <p class="card-meta" style="margin-bottom: 12px;">Total votes: ${totalVotes}</p>
        <div>${optionsHTML}</div>
      </div>
      ${isAdmin ? `
        <div class="card-actions" style="margin-top: 10px;">
          <button class="btn-delete" onclick="deleteItem('polls', ${poll.id})">Delete Poll</button>
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   User Action Handlers (Add, Delete, Vote)
   ========================================================================== */

function handleAddNotice(e) {
  e.preventDefault();
  const newNotice = {
    id: Date.now(),
    title: document.getElementById('noticeTitle').value,
    category: document.getElementById('noticeCategory').value,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    content: document.getElementById('noticeContent').value
  };

  notices.unshift(newNotice);
  saveData();
  renderNotices();
  closeModal('noticeModal');
  e.target.reset();
}

function handleAddMaterial(e) {
  e.preventDefault();
  const newMaterial = {
    id: Date.now(),
    title: document.getElementById('materialTitle').value,
    course: document.getElementById('materialCourse').value,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    link: document.getElementById('materialLink').value
  };

  materials.unshift(newMaterial);
  saveData();
  renderMaterials();
  closeModal('materialModal');
  e.target.reset();
}

function handleAddEvent(e) {
  e.preventDefault();
  const newEvent = {
    id: Date.now(),
    title: document.getElementById('eventTitle').value,
    date: document.getElementById('eventDate').value,
    location: document.getElementById('eventLocation').value
  };

  events.push(newEvent);
  saveData();
  renderEvents();
  closeModal('eventModal');
  e.target.reset();
}

function handleCreatePoll(e) {
  e.preventDefault();
  const question = document.getElementById('pollQuestion').value;
  const optionsRaw = document.getElementById('pollOptions').value.split(',');
  
  const options = optionsRaw.map(opt => ({
    text: opt.trim(),
    votes: 0
  })).filter(opt => opt.text !== '');

  if (options.length < 2) {
    alert('Please enter at least two options separated by commas.');
    return;
  }

  const newPoll = {
    id: Date.now(),
    question,
    options
  };

  polls.unshift(newPoll);
  saveData();
  renderPolls();
  closeModal('pollModal');
  e.target.reset();
}

function votePoll(pollId, optionIndex) {
  const poll = polls.find(p => p.id === pollId);
  if (poll) {
    poll.options[optionIndex].votes += 1;
    saveData();
    renderPolls();
  }
}

function deleteItem(type, id) {
  if (!confirm('Are you sure you want to delete this entry?')) return;

  if (type === 'notices') notices = notices.filter(item => item.id !== id);
  if (type === 'materials') materials = materials.filter(item => item.id !== id);
  if (type === 'events') events = events.filter(item => item.id !== id);
  if (type === 'polls') polls = polls.filter(item => item.id !== id);

  saveData();
  renderNotices();
  renderMaterials();
  renderEvents();
  renderPolls();
}

/* ==========================================================================
   Filter & UI Setup
   ========================================================================== */

function setupFilters() {
  document.querySelectorAll('#noticeFilters .pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#noticeFilters .pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      renderNotices(e.target.dataset.filter);
    });
  });

  document.querySelectorAll('#materialFilters .pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#materialFilters .pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      renderMaterials(e.target.dataset.filter);
    });
  });
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside modal body
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

/* ==========================================================================
   App Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderNotices();
  renderMaterials();
  renderEvents();
  renderPolls();
  setupFilters();
  lucide.createIcons();
});