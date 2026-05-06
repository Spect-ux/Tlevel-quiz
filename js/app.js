/**
 * app.js — T Level Digital Legislation Quiz
 * Built with Claude (Anthropic) · AI-powered question generation
 */

import Config from './config.js';

// ─── TOPIC REGISTRY ──────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'gdpr',       name: 'Data Protection / GDPR',         ref: '4.1.3' },
  { id: 'cma',        name: 'Computer Misuse Act',             ref: '4.1.4' },
  { id: 'hsa',        name: 'Health & Safety (DSE)',           ref: '4.1.1–2' },
  { id: 'equality',   name: 'Equality Act',                    ref: '4.1.5' },
  { id: 'ip',         name: 'Intellectual Property',           ref: '4.1.6' },
  { id: 'intlaw',     name: 'International Law / Cyberspace',  ref: '4.1.8' },
  { id: 'bcs',        name: 'BCS Code of Conduct',             ref: '4.2.1–2' },
  { id: 'aup',        name: 'Acceptable Use Policy',           ref: '4.2.4' },
  { id: 'standards',  name: 'Industry Standards (ISO/WCAG)',   ref: '4.2.3' },
  { id: 'impact',     name: 'Legislation Impact on Society',   ref: '4.1.7' },
];

// ─── STATE ────────────────────────────────────────────────────────────────────
let state = {
  questions:    [],   // { topic, question, modelAnswer, examinerTip }
  current:      0,
  ratings:      [],   // 'good' | 'partial' | 'fail'
  score:        0,
  selectedTopics: [],
  totalQ:       5,
};

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const dom = {
  topicGrid:      document.getElementById('topicGrid'),
  qCountInput:    document.getElementById('qCountInput'),
  startBtn:       document.getElementById('startBtn'),
  setupSection:   document.getElementById('setupSection'),
  quizWrap:       document.getElementById('quizWrap'),
  resultsScreen:  document.getElementById('resultsScreen'),

  progressDots:   document.getElementById('progressDots'),
  scoreDisplay:   document.getElementById('scoreDisplay'),

  qNumber:        document.getElementById('qNumber'),
  qTopic:         document.getElementById('qTopic'),
  qText:          document.getElementById('qText'),
  answerArea:     document.getElementById('answerArea'),

  submitBtn:      document.getElementById('submitBtn'),
  nextBtn:        document.getElementById('nextBtn'),
  feedbackPanel:  document.getElementById('feedbackPanel'),
  feedbackBody:   document.getElementById('feedbackBody'),
  modelAnswerText:document.getElementById('modelAnswerText'),
  selfRateSection:document.getElementById('selfRateSection'),

  scoreBig:       document.getElementById('scoreBig'),
  scoreMsg:       document.getElementById('scoreMsg'),
  resultsGrid:    document.getElementById('resultsGrid'),

  apiModal:       document.getElementById('apiModal'),
  apiKeyInput:    document.getElementById('apiKeyInput'),
  saveKeyBtn:     document.getElementById('saveKeyBtn'),
  clearKeyBtn:    document.getElementById('clearKeyBtn'),
  apiStatusDot:   document.getElementById('apiStatusDot'),
  apiStatusText:  document.getElementById('apiStatusText'),
};

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  renderTopicGrid();
  updateApiStatus();

  // Pre-select all topics
  state.selectedTopics = TOPICS.map(t => t.id);
  document.querySelectorAll('.topic-card').forEach(c => c.classList.add('selected'));
  updateStartBtn();

  dom.startBtn.addEventListener('click', startQuiz);
  dom.submitBtn.addEventListener('click', handleSubmit);
  dom.nextBtn.addEventListener('click', nextQuestion);
  dom.saveKeyBtn.addEventListener('click', saveApiKey);
  dom.clearKeyBtn.addEventListener('click', clearApiKey);
  dom.qCountInput.addEventListener('change', () => {
    state.totalQ = Math.min(20, Math.max(1, parseInt(dom.qCountInput.value) || 5));
    dom.qCountInput.value = state.totalQ;
  });
}

// ─── TOPIC GRID ───────────────────────────────────────────────────────────────
function renderTopicGrid() {
  dom.topicGrid.innerHTML = '';
  TOPICS.forEach(t => {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.dataset.id = t.id;
    card.innerHTML = `
      <div class="t-check">✓</div>
      <div class="t-name">${t.name}</div>
      <div class="t-ref">${t.ref}</div>
    `;
    card.addEventListener('click', () => toggleTopic(t.id, card));
    dom.topicGrid.appendChild(card);
  });
}

function toggleTopic(id, card) {
  const idx = state.selectedTopics.indexOf(id);
  if (idx === -1) {
    state.selectedTopics.push(id);
    card.classList.add('selected');
  } else {
    state.selectedTopics.splice(idx, 1);
    card.classList.remove('selected');
  }
  updateStartBtn();
}

function updateStartBtn() {
  dom.startBtn.disabled = state.selectedTopics.length === 0 || !Config.hasKey();
  if (!Config.hasKey()) {
    dom.startBtn.textContent = '⚠ Add API Key First';
  } else if (state.selectedTopics.length === 0) {
    dom.startBtn.textContent = 'Select at least one topic';
  } else {
    dom.startBtn.textContent = `Start Quiz →`;
  }
}

// ─── API KEY MODAL ────────────────────────────────────────────────────────────
window.openApiModal = function () {
  dom.apiKeyInput.value = Config.hasKey() ? '••••••••••••••••' : '';
  dom.apiModal.classList.add('show');
};
window.closeApiModal = function () {
  dom.apiModal.classList.remove('show');
};

function saveApiKey() {
  const val = dom.apiKeyInput.value.trim();
  if (!val || val === '••••••••••••••••') { closeApiModal(); return; }
  if (!val.startsWith('sk-ant-')) {
    alert('That doesn\'t look like an Anthropic API key. It should start with sk-ant-');
    return;
  }
  Config.setKey(val);
  updateApiStatus();
  updateStartBtn();
  closeApiModal();
}

function clearApiKey() {
  Config.clearKey();
  dom.apiKeyInput.value = '';
  updateApiStatus();
  updateStartBtn();
}

function updateApiStatus() {
  if (Config.hasKey()) {
    dom.apiStatusDot.style.background = 'var(--correct)';
    dom.apiStatusText.textContent = 'API key saved';
    dom.apiStatusText.style.color = 'var(--correct)';
  } else {
    dom.apiStatusDot.style.background = 'var(--wrong)';
    dom.apiStatusText.textContent = 'No API key';
    dom.apiStatusText.style.color = 'var(--wrong)';
  }
}

// ─── START QUIZ ───────────────────────────────────────────────────────────────
async function startQuiz() {
  if (!Config.hasKey()) { openApiModal(); return; }

  state.questions = [];
  state.current = 0;
  state.ratings = [];
  state.score = 0;
  state.totalQ = parseInt(dom.qCountInput.value) || 5;

  // Show quiz screen
  dom.setupSection.classList.add('hidden');
  dom.quizWrap.classList.add('active');
  dom.resultsScreen.classList.remove('active');

  // Build progress dots
  dom.progressDots.innerHTML = '';
  for (let i = 0; i < state.totalQ; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' current' : '');
    dom.progressDots.appendChild(d);
  }
  dom.scoreDisplay.innerHTML = `Score: <span>0</span>`;

  // Generate first question then eagerly generate rest in background
  await loadQuestion(0);
  prefetchRemaining();
}

// ─── QUESTION GENERATION ──────────────────────────────────────────────────────
async function generateQuestion(topicIds) {
  const pick = topicIds[Math.floor(Math.random() * topicIds.length)];
  const topic = TOPICS.find(t => t.id === pick);

  const topicDescriptions = {
    gdpr:      'Data Protection Act / GDPR: the 8 principles, rights of data subjects, ICO, breach consequences, 72-hour notification, fines (4% global turnover or £17.5m)',
    cma:       'Computer Misuse Act 1990: the 3 offences (S1 unauthorised access, S2 intent to commit further offences, S3 unauthorised modification), penalties, employer/employee consequences',
    hsa:       'Health & Safety at Work Act and Display Screen Equipment (DSE) regulations: employer obligations, workstation assessments, breaks, eye tests, training',
    equality:  'Equality Act 2010: 9 protected characteristics, 4 types of discrimination (direct, indirect, harassment, victimisation), time limits for claims',
    ip:        'Intellectual Property: registered designs, unregistered designs, patents — differences in protection, registration, duration, and relevance to software developers',
    intlaw:    'International law in cyberspace: Budapest Convention, cross-border cyber offences, international surveillance law, GDPR applying globally',
    bcs:       'BCS Code of Conduct and professional codes from IAP and CIISec: public interest, competence, integrity, duty to employer/client, confidentiality',
    aup:       'Acceptable Use Policies: purpose, permitted activities, prohibited activities, confidentiality, communication etiquette, sanctions',
    standards: 'Digital industry standards: ISO, WCAG (Web Content Accessibility Guidelines), W3C, IETF, PCI SSC, IEEE — purpose and relevance',
    impact:    'Interrelationship between digital legislation and software development: impact on organisations, individuals, and society — extended evaluative response',
  };

  const alreadyAsked = state.questions.map(q => q.rawTopic).filter(Boolean);
  const avoidNote = alreadyAsked.length ? `\nIMPORTANT: Do NOT ask about these topics again: ${alreadyAsked.join(', ')}.` : '';

  const systemPrompt = `You are an expert examiner for the Pearson T Level Technical Qualification in Digital Software Development (Level 3), Content Area 4: Legislation and Regulatory Requirements.

You generate exam-style questions that require detailed, explanatory answers — not multiple choice. Questions should vary in style:
- "Explain the difference between X and Y"
- "A company has done X. Describe FOUR consequences..."
- "Evaluate how [legislation] affects [stakeholders]..."
- "State and explain THREE [things] under [act]..."

Always return valid JSON only. No markdown, no backticks, no preamble.`;

  const userPrompt = `Generate ONE exam question about: ${topicDescriptions[pick]}
${avoidNote}

Return this exact JSON structure:
{
  "topic": "${topic.name}",
  "question": "The full exam question text",
  "modelAnswer": "A thorough model answer a student should aim for (4-8 sentences, covering key points)",
  "examinerTip": "A brief tip about what examiners specifically look for (1-2 sentences)"
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Config.getKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.content[0].text.trim();
  const parsed = JSON.parse(raw);
  parsed.rawTopic = pick;
  return parsed;
}

// ─── GRADING ──────────────────────────────────────────────────────────────────
async function gradeAnswer(question, answer) {
  const prompt = `You are a T Level Digital examiner. Grade this student's response.

QUESTION: ${question.question}
MODEL ANSWER KEY POINTS: ${question.modelAnswer}
STUDENT'S ANSWER: ${answer}

Provide brief, specific feedback (2-3 sentences) that:
1. Acknowledges what they got right
2. Points out what was missing or could be improved
3. References the mark scheme criteria

Be encouraging but honest. Return plain text only — no markdown, no bullet points, no lists. Just 2-3 sentences of feedback.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Config.getKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.content[0].text.trim();
}

// ─── LOAD QUESTION ────────────────────────────────────────────────────────────
async function loadQuestion(index) {
  dom.qText.className = 'q-text loading';
  dom.qText.textContent = 'Generating question...';
  dom.qTopic.textContent = '...';
  dom.qNumber.textContent = `Q${index + 1} of ${state.totalQ}`;
  dom.answerArea.value = '';
  dom.answerArea.disabled = true;
  dom.submitBtn.disabled = true;
  dom.nextBtn.classList.add('hidden');
  dom.feedbackPanel.classList.remove('show');
  dom.selfRateSection.classList.add('hidden');

  try {
    // Use pre-fetched question if available, else generate
    let q = state.questions[index];
    if (!q) {
      q = await generateQuestion(state.selectedTopics);
      state.questions[index] = q;
    }

    dom.qText.className = 'q-text';
    dom.qText.textContent = q.question;
    dom.qTopic.textContent = q.topic;
    dom.answerArea.disabled = false;
    dom.submitBtn.disabled = false;
    dom.answerArea.focus();

  } catch (err) {
    dom.qText.className = 'q-text';
    dom.qText.textContent = '⚠ Failed to generate question. Check your API key and try again.';
    dom.qText.style.color = 'var(--wrong)';
    console.error(err);
  }
}

async function prefetchRemaining() {
  for (let i = 1; i < state.totalQ; i++) {
    if (!state.questions[i]) {
      try {
        const q = await generateQuestion(state.selectedTopics);
        state.questions[i] = q;
      } catch (e) {
        // Will be generated on-demand when reached
      }
      await new Promise(r => setTimeout(r, 300)); // Stagger calls
    }
  }
}

// ─── SUBMIT ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  const answer = dom.answerArea.value.trim();
  if (!answer) { dom.answerArea.focus(); return; }

  dom.answerArea.disabled = true;
  dom.submitBtn.disabled = true;
  dom.submitBtn.textContent = 'Marking...';

  const q = state.questions[state.current];

  // Show feedback panel with loading state
  dom.feedbackPanel.classList.add('show');
  dom.feedbackBody.innerHTML = '<span style="color:var(--muted)">Getting feedback...</span>';
  dom.modelAnswerText.textContent = q.modelAnswer;
  if (q.examinerTip) {
    dom.modelAnswerText.textContent += `\n\n💡 Examiner tip: ${q.examinerTip}`;
  }

  const feedback = await gradeAnswer(q, answer);
  dom.feedbackBody.innerHTML = feedback
    ? feedback
    : 'Compare your answer to the model answer below.';

  dom.selfRateSection.classList.remove('hidden');
  dom.submitBtn.textContent = 'Submit Answer';
  dom.nextBtn.classList.remove('hidden');

  // Scroll to feedback
  dom.feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── RATING ───────────────────────────────────────────────────────────────────
window.rateAnswer = function(level) {
  // Remove previous selection
  document.querySelectorAll('.rate-btn').forEach(b => b.className = 'rate-btn');
  const map = { good: 'g', partial: 'p', fail: 'f' };
  event.currentTarget.className = `rate-btn ${map[level]}`;

  state.ratings[state.current] = level;
};

// ─── NEXT QUESTION ────────────────────────────────────────────────────────────
function nextQuestion() {
  const rating = state.ratings[state.current];
  if (!rating) {
    // Gently remind
    dom.selfRateSection.querySelector('p').textContent = '← Please rate your answer first';
    dom.selfRateSection.querySelector('p').style.color = 'var(--accent2)';
    return;
  }

  // Update score
  if (rating === 'good')    state.score += 2;
  if (rating === 'partial') state.score += 1;

  // Update dots
  const dots = dom.progressDots.querySelectorAll('.dot');
  dots[state.current].classList.remove('current');
  dots[state.current].classList.add('done');

  state.current++;
  dom.scoreDisplay.innerHTML = `Score: <span>${state.score}</span>`;

  if (state.current >= state.totalQ) {
    showResults();
    return;
  }

  if (state.current < dots.length) {
    dots[state.current].classList.add('current');
  }

  loadQuestion(state.current);
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function showResults() {
  dom.quizWrap.classList.remove('active');
  dom.resultsScreen.classList.add('active');

  const max = state.totalQ * 2;
  const pct = Math.round((state.score / max) * 100);
  dom.scoreBig.textContent = `${state.score}/${max}`;

  let msg = '';
  if (pct >= 80) msg = '🔥 Excellent — solid exam readiness';
  else if (pct >= 60) msg = '✓ Good — a few areas to revisit';
  else if (pct >= 40) msg = '⚠ Keep going — review the topics you missed';
  else msg = '📚 Study mode — use the model answers as revision notes';
  dom.scoreMsg.textContent = msg;

  dom.resultsGrid.innerHTML = '';
  state.questions.forEach((q, i) => {
    const r = state.ratings[i] || 'fail';
    const map = { good: ['g', '✓ Got it (+2)'], partial: ['p', '~ Partial (+1)'], fail: ['f', '✗ Missed (+0)'] };
    const [cls, label] = map[r];
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `<div class="ri-topic">${q?.topic || '?'}</div><div class="ri-verdict ${cls}">${label}</div>`;
    dom.resultsGrid.appendChild(div);
  });
}

window.retryQuiz = function() {
  dom.resultsScreen.classList.remove('active');
  dom.setupSection.classList.remove('hidden');
};

window.retakeQuiz = function() {
  dom.resultsScreen.classList.remove('active');
  startQuiz();
};

// ─── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
