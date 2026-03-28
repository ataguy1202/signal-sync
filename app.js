// ─── TOAST SYSTEM ───
function toast(msg, type='info', duration=3500) {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, duration);
}

// ─── MODAL SYSTEM ───
function openModal(title, body, actions) {
  const o = document.getElementById('modalOverlay');
  const m = document.getElementById('modalContent');
  m.innerHTML = `<h3>${title}</h3><p>${body}</p><div class="modal-actions">${actions}</div>`;
  o.classList.add('active');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}
document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── NAV SCROLL ───
window.addEventListener('scroll', () => {
  document.getElementById('gnav').classList.toggle('scrolled', window.scrollY > 10);
});

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ─── VIEW MANAGEMENT ───
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

function enterApp() {
  showView('app');
  document.getElementById('navLinks').innerHTML = `
    <a class="nav-link active" onclick="appNav('dashboard')">Dashboard</a>
    <a class="nav-link" onclick="appNav('candidates')">Candidates</a>
    <a class="nav-link" onclick="appNav('analytics')">Analytics</a>
    <a class="nav-link" onclick="appNav('settings')">Settings</a>
  `;
  document.getElementById('navRight').innerHTML = `
    <button class="btn btn-g" onclick="showView('landing');resetNav();" title="Exit demo">Exit Demo</button>
    <div class="nav-avatar">SR</div>
  `;
  // Start guided tour after small delay
  setTimeout(startTour, 600);
}

function resetNav() {
  document.getElementById('navLinks').innerHTML = `
    <a class="nav-link" onclick="scrollTo('pain')">Problem</a>
    <a class="nav-link" onclick="scrollTo('how')">How It Works</a>
  `;
  document.getElementById('navRight').innerHTML = `<button class="nav-cta" onclick="enterApp()">Try the Demo</button>`;
}

// ─── APP NAV ───
function appNav(section) {
  document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('app-' + section);
  if (el) { el.classList.add('active'); }
  // Update sidebar
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  const sb = document.querySelector(`[data-sb="${section}"]`);
  if (sb) sb.classList.add('active');
  // Update nav links
  document.querySelectorAll('#navLinks .nav-link').forEach(l => {
    l.classList.toggle('active', l.textContent.trim().toLowerCase().includes(section));
  });
  window.scrollTo(0, 0);
  // Animate charts if analytics
  if (section === 'analytics') setTimeout(animateCharts, 200);
}

function openDebrief() {
  appNav('debrief');
}

// ─── QUEUE TABS ───
const queueData = {
  pending: ['am','kj','sl'],
  completed: ['completed1','completed2'],
  all: ['am','kj','tp','rw','sl','completed1','completed2']
};

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const rows = document.querySelectorAll('.q-row:not(.head)');
  rows.forEach(r => {
    const id = r.dataset.id;
    if (tab === 'pending') r.style.display = queueData.pending.includes(id) ? 'grid' : 'none';
    else if (tab === 'completed') r.style.display = queueData.completed.includes(id) ? 'grid' : 'none';
    else r.style.display = 'grid';
  });
}

// ─── INTERVIEWER EXPAND ───
function toggleInt(card) {
  const was = card.classList.contains('expanded');
  card.classList.toggle('expanded');
  card.querySelector('.int-hint').textContent = was ? 'View feedback' : 'Hide feedback';
}

// ─── SIGNAL ANIMATION ───
const signals = [
  { fill:'sf1', val:'sv1', score:9.2, pct:92 },
  { fill:'sf2', val:'sv2', score:7.8, pct:78 },
  { fill:'sf3', val:'sv3', score:9.0, pct:90 },
  { fill:'sf4', val:'sv4', score:8.5, pct:85 },
  { fill:'sf5', val:'sv5', score:8.8, pct:88 },
  { fill:'sf6', val:'sv6', score:6.5, pct:65 },
];

function animateSignals() {
  signals.forEach((s, i) => {
    setTimeout(() => {
      const f = document.getElementById(s.fill);
      if (f) f.style.width = s.pct + '%';
      let cur = 0;
      const inc = s.score / 15;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, s.score);
        const v = document.getElementById(s.val);
        if (v) v.textContent = cur.toFixed(1);
        if (cur >= s.score) clearInterval(timer);
      }, 30);
    }, i * 100);
  });
}

// ─── SYNTHESIS ENGINE ───
const phases = [
  { text:'Reading interviewer feedback...', sub:'Processing 4 feedback submissions' },
  { text:'Extracting key signals...', sub:'Analyzing rubric scores and freeform notes' },
  { text:'Detecting consensus patterns...', sub:'Cross-referencing 4 perspectives' },
  { text:'Computing signal strengths...', sub:'Aggregating across 6 competency dimensions' },
  { text:'Generating hiring brief...', sub:'Composing summary and recommendation' },
];

const synthHTML = `
<div class="synth-content">
  <h4>Executive Summary</h4>
  <p>Aisha Martinez is a <span class="hl">high-signal candidate</span> with particularly strong system design and communication skills. Across 4 interviewers, she received 2 Strong Hires, 1 Hire, and 1 Leaning Hire — placing her in the <span class="hl">top 10% of candidates</span> interviewed for this role this quarter.</p>
  <h4>Key Strengths</h4>
  <p>Her system design interview was rated one of the strongest this quarter (James Chen, Staff Eng). She demonstrates <span class="hl">senior-level judgment</span> in technical tradeoffs and proactively addresses failure modes. Her behavioral interview revealed strong self-awareness, cross-team leadership experience, and genuine curiosity about team dynamics.</p>
  <h4>Areas to Note</h4>
  <p>One interviewer observed she invests more time upfront planning before coding, compressing implementation time. Assessed as a <span class="hl">style difference, not a competency gap</span> — her code quality was notably high, near-zero bugs on first pass. Derek Williams noted limited fluency in ML pipeline integration, assessed as learnable.</p>
  <h4>Risk Assessment</h4>
  <p>Low. The one "Leaning Hire" was driven by a domain-specific gap (ML pipelines), not a fundamental skill concern. All 4 interviewers expressed willingness to work with her. No cultural or behavioral flags raised.</p>
</div>`;

function runSynthesis() {
  const body = document.getElementById('synthBody');
  const btn = document.getElementById('synthBtn');
  btn.disabled = true; btn.style.opacity = '.5'; btn.textContent = 'Synthesizing...';

  body.innerHTML = `<div class="synth-loading"><div class="spinner"></div><div id="loadText" style="font-size:13px;color:var(--text2);font-weight:500">Initializing...</div><div id="loadSub" style="font-size:12px;color:var(--text3)"></div></div>`;

  phases.forEach((p, i) => {
    setTimeout(() => {
      const lt = document.getElementById('loadText');
      const ls = document.getElementById('loadSub');
      if (lt) lt.textContent = p.text;
      if (ls) ls.textContent = p.sub;
    }, i * 650);
  });

  setTimeout(() => {
    body.innerHTML = synthHTML;
    body.style.animation = 'fadeIn .4s ease';
    animateSignals();
  }, 3400);

  setTimeout(() => {
    document.getElementById('consCard').style.display = 'block';
    document.getElementById('consCard').style.animation = 'fadeUp .4s ease';
  }, 4000);

  setTimeout(() => {
    document.getElementById('recCard').style.display = 'block';
    document.getElementById('recCard').style.animation = 'fadeUp .4s ease';
    const steps = document.querySelectorAll('.pipe');
    steps[4].classList.remove('active'); steps[4].classList.add('done');
    steps[4].querySelector('.pipe-dot').textContent = '\u2713';
    steps[5].classList.add('active');
    btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Re-synthesize';
    document.getElementById('exportBtn').style.display = 'inline-flex';
    toast('Synthesis complete — hiring brief ready', 'success');
    // Advance tour to final step
    if (tourActive && tourStep === 3) {
      tourStep = 4;
      setTimeout(() => showTourStep(4), 800);
    }
  }, 4600);
}

// ─── BUTTON HANDLERS ───
function sendToHM() {
  openModal(
    'Send to Hiring Manager',
    'This will send the synthesized debrief and hiring recommendation to the hiring manager for review. They will receive an email with the full brief and can approve or request changes.',
    `<button class="btn btn-g" onclick="closeModal()">Cancel</button>
     <button class="btn btn-p" onclick="closeModal();toast('Brief sent to hiring manager','success')">Send Brief</button>`
  );
}

function scheduleCommittee() {
  openModal(
    'Schedule Committee Review',
    'Select a time slot for the hiring committee to review this candidate. The synthesized brief will be automatically attached to the calendar invite.',
    `<button class="btn btn-g" onclick="closeModal()">Cancel</button>
     <button class="btn btn-p" onclick="closeModal();toast('Committee review scheduled for Thursday 2pm','success')">Schedule</button>`
  );
}

function exportBrief() {
  toast('Generating PDF brief...', 'info', 2000);
  setTimeout(() => toast('Brief exported successfully', 'success'), 2200);
}

function addNewRole() {
  openModal(
    'Add New Role',
    'Create a new role to start tracking candidates and collecting interviewer feedback. SignalSync will automatically configure signal dimensions based on the role type.',
    `<button class="btn btn-g" onclick="closeModal()">Cancel</button>
     <button class="btn btn-p" onclick="closeModal();toast('Role created successfully','success')">Create Role</button>`
  );
}

// ─── TOGGLE SETTINGS ───
function toggleSetting(el) {
  el.classList.toggle('on');
  const label = el.closest('.setting-row').querySelector('.setting-label').textContent;
  toast(label + (el.classList.contains('on') ? ' enabled' : ' disabled'), 'info', 2000);
}

// ─── ANALYTICS CHARTS ───
function animateCharts() {
  document.querySelectorAll('.chart-bar').forEach(bar => {
    const h = bar.dataset.h;
    setTimeout(() => { bar.style.height = h + '%'; }, 100);
  });
}

// ─── GUIDED TOUR ───
let tourActive = false;
let tourStep = 0;
const tourSteps = [
  {
    title: 'Welcome to SignalSync',
    text: 'This is your dashboard — a single view of every pending debrief, your pipeline metrics, and time saved. No more digging through emails and docs.',
    target: '.metrics',
    position: 'bottom',
    align: 'center'
  },
  {
    title: 'Your Debrief Queue',
    text: 'Candidates appear here once their interviews are complete. A green "Ready" badge means all interviewers have submitted and AI synthesis is available.',
    target: '.queue-card',
    position: 'top',
    align: 'center'
  },
  {
    title: 'Click on Aisha Martinez',
    text: 'She just finished her final round with 4 interviewers. All feedback is in. Click her row to open the debrief.',
    target: '[data-id="am"]',
    position: 'bottom',
    align: 'left',
    waitForNav: 'debrief'
  },
  {
    title: 'Hit "Synthesize Feedback"',
    text: 'This is the core of SignalSync. It reads all 4 interviewer submissions, detects consensus and conflicts, computes signal strength, and generates a hiring brief — in seconds, not 47 minutes.',
    target: '.cand-right',
    position: 'bottom',
    align: 'right',
    waitForSynth: true
  },
  {
    title: 'Your AI-powered debrief is ready',
    text: 'The synthesis, consensus analysis, signal scores, and hiring recommendation are all generated. You can now send this directly to the hiring manager or schedule a committee review. Explore the rest of the app freely!',
    target: '.rec-box',
    position: 'top',
    align: 'center'
  },
];

function startTour() {
  tourActive = true;
  tourStep = 0;
  showTourStep(0);
}

function showTourStep(step) {
  document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
  const overlay = document.getElementById('tourOverlay');
  const tip = document.getElementById('tourTip');

  if (step >= tourSteps.length) {
    overlay.classList.remove('active');
    tip.classList.remove('active');
    tourActive = false;
    toast('Tour complete — explore freely!', 'success');
    return;
  }

  const s = tourSteps[step];
  const target = document.querySelector(s.target);

  if (!target) return;

  target.classList.add('tour-highlight');
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const isLast = step === tourSteps.length - 1;
  const actionStep = s.waitForNav || s.waitForSynth;
  let nextLabel = isLast ? 'Finish Tour' : 'Next';
  let nextAction = isLast ? 'endTour()' : 'nextTour()';

  tip.innerHTML = `
    <div class="tour-arrow ${s.position === 'bottom' ? 'top' : 'bottom'}"></div>
    <h4>${s.title}</h4>
    <p>${s.text}</p>
    <div class="tour-steps">Step ${step + 1} of ${tourSteps.length}</div>
    <div class="tour-btns">
      <button class="btn btn-g btn-sm" onclick="endTour()">Skip</button>
      ${!actionStep ? `<button class="btn btn-p btn-sm" onclick="${nextAction}">${nextLabel}</button>` : ''}
    </div>
  `;

  // Wait a tick so tip has dimensions
  requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let top, left;

    // Vertical: place below or above target
    if (s.position === 'bottom') {
      top = rect.bottom + 14;
    } else {
      top = rect.top - tipRect.height - 14;
    }

    // Horizontal: align to target
    if (s.align === 'right') {
      left = rect.right - tipRect.width;
    } else if (s.align === 'center') {
      left = rect.left + (rect.width / 2) - (tipRect.width / 2);
    } else {
      left = rect.left;
    }

    // Keep on screen
    left = Math.max(260, Math.min(left, window.innerWidth - tipRect.width - 20));
    top = Math.max(66, top);

    // Update arrow position to point at target center
    const arrowLeft = Math.max(20, Math.min(rect.left + rect.width / 2 - left, tipRect.width - 30));
    const arrow = tip.querySelector('.tour-arrow');
    if (arrow) arrow.style.left = arrowLeft + 'px';

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    tip.classList.add('active');
    overlay.classList.add('active');
  });
}

function nextTour() {
  tourStep++;
  showTourStep(tourStep);
}

function endTour() {
  document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
  document.getElementById('tourOverlay').classList.remove('active');
  document.getElementById('tourTip').classList.remove('active');
  tourActive = false;
}

// Hook: clicking Aisha advances tour step 2 → 3
const origOpenDebrief = openDebrief;
openDebrief = function() {
  origOpenDebrief();
  if (tourActive && tourStep === 2) {
    tourStep = 3;
    setTimeout(() => showTourStep(3), 500);
  }
};
