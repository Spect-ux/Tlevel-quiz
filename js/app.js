/**
 * app.js — T Level Digital Quiz
 * Dual mode: AI-powered (Anthropic API key) + Free (copy-paste prompt → JSON)
 * Built by Spect & Claude (Anthropic)
 */

import Config from './config.js';
import TOPICS from './topics.js';

// ─── STATE ────────────────────────────────────────────────────────────────────
let S = {
  questions: [], current: 0, ratings: [], score: 0,
  selectedTopics: TOPICS.map(t => t.id),
  totalQ: 5, mode: 'free', // 'free' | 'api'
};

// ─── DOM ──────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const dom = {
  topicGrid: $('topicGrid'), qCountInput: $('qCountInput'),
  startBtn: $('startBtn'), setupSection: $('setupSection'),
  quizWrap: $('quizWrap'), resultsScreen: $('resultsScreen'),
  progressDots: $('progressDots'), scoreDisplay: $('scoreDisplay'),
  qNum: $('qNum'), qTopic: $('qTopic'), qPaper: $('qPaper'), qText: $('qText'),
  answerArea: $('answerArea'), submitBtn: $('submitBtn'), nextBtn: $('nextBtn'),
  feedbackPanel: $('feedbackPanel'), fbBody: $('fbBody'),
  modelAnswerText: $('modelAnswerText'), selfRate: $('selfRate'),
  scoreBig: $('scoreBig'), scoreMsg: $('scoreMsg'), resultsGrid: $('resultsGrid'),
  apiModal: $('apiModal'), apiKeyInput: $('apiKeyInput'),
  saveKeyBtn: $('saveKeyBtn'), clearKeyBtn: $('clearKeyBtn'),
  apiDot: $('apiDot'), apiLabel: $('apiLabel'),
  tabFree: $('tabFree'), tabApi: $('tabApi'),
  freePanel: $('freePanel'), apiPanel: $('apiPanel'),
  promptBox: $('promptBox'), copyPromptBtn: $('copyPromptBtn'), copyConfirm: $('copyConfirm'),
  jsonPaste: $('jsonPaste'), loadJsonBtn: $('loadJsonBtn'), jsonErr: $('jsonErr'),
  markingPromptBox: $('markingPromptBox'), copyMarkBtn: $('copyMarkBtn'), copyMarkConfirm: $('copyMarkConfirm'),
  markJsonPaste: $('markJsonPaste'), loadMarkBtn: $('loadMarkBtn'),
  markingSection: $('markingSection'),
};

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  renderTopicGrid();
  updateApiStatus();
  updateStartBtn();

  dom.startBtn.addEventListener('click', startQuiz);
  dom.submitBtn.addEventListener('click', handleSubmit);
  dom.nextBtn.addEventListener('click', nextQuestion);
  dom.saveKeyBtn.addEventListener('click', saveApiKey);
  dom.clearKeyBtn.addEventListener('click', clearApiKey);
  dom.copyPromptBtn.addEventListener('click', copyPrompt);
  dom.loadJsonBtn.addEventListener('click', loadFromJson);
  dom.copyMarkBtn?.addEventListener('click', copyMarkingPrompt);
  dom.loadMarkBtn?.addEventListener('click', loadMarkingJson);
  dom.qCountInput.addEventListener('change', () => {
    S.totalQ = Math.min(20, Math.max(1, parseInt(dom.qCountInput.value) || 5));
    dom.qCountInput.value = S.totalQ;
  });
}

// ─── TOPIC GRID ───────────────────────────────────────────────────────────────
function renderTopicGrid() {
  const papers = [...new Set(TOPICS.map(t => t.paper))];
  papers.forEach(paper => {
    const hdr = document.createElement('div');
    hdr.style.cssText = 'grid-column:1/-1;font-size:.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--accent4);padding:8px 0 4px;font-weight:600';
    hdr.textContent = paper;
    dom.topicGrid.appendChild(hdr);

    TOPICS.filter(t => t.paper === paper).forEach(t => {
      const card = document.createElement('div');
      card.className = 'topic-card selected';
      card.dataset.id = t.id;
      card.innerHTML = `<div class="tc-check">✓</div><div class="tc-name">${t.name}</div><div class="tc-ref">${t.ref}</div>`;
      card.addEventListener('click', () => toggleTopic(t.id, card));
      dom.topicGrid.appendChild(card);
    });
  });
}

function toggleTopic(id, card) {
  const i = S.selectedTopics.indexOf(id);
  if (i === -1) { S.selectedTopics.push(id); card.classList.add('selected'); }
  else { S.selectedTopics.splice(i, 1); card.classList.remove('selected'); }
  updateStartBtn();
}

function updateStartBtn() {
  const ok = S.selectedTopics.length > 0;
  dom.startBtn.disabled = !ok;
  dom.startBtn.textContent = ok ? 'Start Quiz →' : 'Select at least one topic';
}

// ─── MODE TABS ────────────────────────────────────────────────────────────────
window.setMode = function(mode) {
  S.mode = mode;
  dom.tabFree.classList.toggle('active', mode === 'free');
  dom.tabApi.classList.toggle('active', mode === 'api');
  dom.freePanel.classList.toggle('hidden', mode !== 'free');
  dom.apiPanel.classList.toggle('hidden', mode !== 'api');
};

// ─── API KEY MODAL ────────────────────────────────────────────────────────────
window.openApiModal = function() {
  dom.apiKeyInput.value = Config.has() ? '••••••••••••••••' : '';
  dom.apiModal.classList.add('show');
};
window.closeApiModal = function() { dom.apiModal.classList.remove('show'); };

function saveApiKey() {
  const v = dom.apiKeyInput.value.trim();
  if (!v || v === '••••••••••••••••') { closeApiModal(); return; }
  if (!v.startsWith('sk-ant-')) { alert('API key should start with sk-ant-'); return; }
  Config.set(v); updateApiStatus(); closeApiModal();
}
function clearApiKey() { Config.clear(); dom.apiKeyInput.value = ''; updateApiStatus(); }
function updateApiStatus() {
  const ok = Config.has();
  dom.apiDot.style.background = ok ? 'var(--correct)' : 'var(--wrong)';
  dom.apiLabel.textContent = ok ? 'API ready' : 'No API key';
  dom.apiLabel.style.color = ok ? 'var(--correct)' : 'var(--wrong)';
}

// ─── PROMPT ENGINEERING ───────────────────────────────────────────────────────
function buildQuizPrompt(topicIds, count) {
  const selected = TOPICS.filter(t => topicIds.includes(t.id));
  const topicList = selected.map(t => `- ${t.name} (${t.ref}, ${t.paper}): ${t.desc}`).join('\n');

  return `You are an expert examiner for the Pearson T Level Technical Qualification in Digital Software Development (Level 3).

Generate exactly ${count} exam-style questions covering the topics listed below.
Questions should require detailed written answers — NOT multiple choice.
Vary question styles: "Explain...", "Describe FOUR...", "Compare X and Y...", "A company has done X, evaluate...", "State and explain THREE..."

TOPICS TO DRAW FROM:
${topicList}

CRITICAL: Respond with ONLY a valid JSON array. No markdown, no backticks, no explanation, no preamble.
The array must contain exactly ${count} objects, each with this exact structure:
{
  "topic": "exact topic name from the list above",
  "paper": "Core Paper 1 or Core Paper 2",
  "question": "the full exam question text",
  "modelAnswer": "a thorough model answer covering key points (4-8 sentences)",
  "examinerTip": "one sentence on what examiners specifically look for"
}

Return ONLY the JSON array starting with [ and ending with ]. Nothing else.`;
}

function buildMarkingPrompt(question, answer) {
  return `You are a T Level Digital examiner marking a student's written answer.

QUESTION: ${question.question}
MODEL ANSWER KEY POINTS: ${question.modelAnswer}
STUDENT'S ANSWER: ${answer}

Provide feedback in 2-3 sentences that:
1. Acknowledges what they got right
2. Points out the most important missing point
3. Gives one specific improvement tip

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no preamble.
Use this exact structure:
{"feedback": "your 2-3 sentence feedback here"}

Return ONLY the JSON object. Nothing else.`;
}

// ─── FREE MODE — PROMPT COPY ──────────────────────────────────────────────────
function generateAndShowPrompt() {
  const prompt = buildQuizPrompt(S.selectedTopics, S.totalQ);
  dom.promptBox.textContent = prompt;
}

function copyPrompt() {
  const text = dom.promptBox.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    dom.copyConfirm.classList.add('show');
    setTimeout(() => dom.copyConfirm.classList.remove('show'), 2000);
  });
}

function loadFromJson() {
  const raw = dom.jsonPaste.value.trim();
  dom.jsonErr.style.display = 'none';
  if (!raw) { showJsonErr('Please paste the JSON from Claude first.'); return; }

  try {
    let cleaned = raw.replace(/```json|```/g, '').trim();
    // Find the JSON array even if there's surrounding text
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!arrMatch) throw new Error('No JSON array found');
    const parsed = JSON.parse(arrMatch[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Expected a JSON array');
    if (!parsed[0].question) throw new Error('Questions missing required fields');

    S.questions = parsed;
    S.totalQ = parsed.length;
    launchQuiz();
  } catch (e) {
    showJsonErr(`Invalid JSON: ${e.message}. Make sure you copied the full response from Claude.`);
  }
}

function showJsonErr(msg) {
  dom.jsonErr.textContent = msg;
  dom.jsonErr.style.display = 'block';
}

// ─── API MODE ─────────────────────────────────────────────────────────────────
async function generateViaApi(topicIds, count) {
  const prompt = buildQuizPrompt(topicIds, count);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Config.get(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || `API ${res.status}`); }
  const data = await res.json();
  const raw = data.content[0].text.trim();
  const arrMatch = raw.match(/\[[\s\S]*\]/);
  if (!arrMatch) throw new Error('No JSON array in response');
  return JSON.parse(arrMatch[0]);
}

async function gradeViaApi(question, answer) {
  const prompt = buildMarkingPrompt(question, answer);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Config.get(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const raw = data.content[0].text.trim();
  try {
    const obj = JSON.parse(raw.replace(/```json|```/g,'').trim());
    return obj.feedback || null;
  } catch { return raw; }
}

// ─── START QUIZ ───────────────────────────────────────────────────────────────
async function startQuiz() {
  S.totalQ = parseInt(dom.qCountInput.value) || 5;

  if (S.mode === 'free') {
    generateAndShowPrompt();
    showFreeModeFlow();
    setTimeout(() => dom.promptBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    return;
  }

  // API mode
  if (!Config.has()) { openApiModal(); return; }

  dom.startBtn.disabled = true;
  dom.startBtn.textContent = 'Generating questions...';

  try {
    S.questions = await generateViaApi(S.selectedTopics, S.totalQ);
    S.current = 0; S.ratings = []; S.score = 0;
    launchQuiz();
  } catch (e) {
    dom.startBtn.disabled = false;
    dom.startBtn.textContent = 'Start Quiz →';
    alert(`Failed to generate questions: ${e.message}`);
  }
}

function launchQuiz() {
  S.current = 0; S.ratings = []; S.score = 0;
  dom.setupSection.classList.add('hidden');
  dom.quizWrap.classList.add('active');
  dom.resultsScreen.classList.remove('active');

  // Build dots
  dom.progressDots.innerHTML = '';
  for (let i = 0; i < S.totalQ; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' current' : '');
    dom.progressDots.appendChild(d);
  }
  dom.scoreDisplay.innerHTML = `Score: <span>0</span>`;
  loadQuestion(0);
}

// ─── LOAD QUESTION ────────────────────────────────────────────────────────────
function loadQuestion(idx) {
  const q = S.questions[idx];
  dom.qNum.textContent = `Q${idx + 1} of ${S.totalQ}`;
  dom.qTopic.textContent = q.topic;
  dom.qPaper.textContent = q.paper || '';
  dom.qText.className = 'q-text';
  dom.qText.textContent = q.question;
  dom.answerArea.value = '';
  dom.answerArea.disabled = false;
  dom.answerArea.focus();
  dom.submitBtn.disabled = false;
  dom.submitBtn.textContent = 'Submit Answer';
  dom.nextBtn.classList.add('hidden');
  dom.feedbackPanel.classList.remove('show');
  if (dom.markingSection) dom.markingSection.classList.add('hidden');
  if (dom.selfRate) dom.selfRate.classList.add('hidden');
  document.querySelectorAll('.rate-btn').forEach(b => b.className = 'rate-btn');
}

// ─── SUBMIT ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  const answer = dom.answerArea.value.trim();
  if (!answer) { dom.answerArea.focus(); return; }

  dom.answerArea.disabled = true;
  dom.submitBtn.disabled = true;
  dom.submitBtn.textContent = 'Marking...';

  const q = S.questions[S.current];
  dom.feedbackPanel.classList.add('show');
  dom.modelAnswerText.textContent = q.modelAnswer + (q.examinerTip ? `\n\n💡 Tip: ${q.examinerTip}` : '');

  if (S.mode === 'api' && Config.has()) {
    // Auto-grade
    dom.fbBody.innerHTML = '<span style="color:var(--muted)">Getting feedback...</span>';
    const fb = await gradeViaApi(q, answer);
    dom.fbBody.textContent = fb || 'Compare your answer to the model answer below.';
    dom.selfRate.classList.remove('hidden');
  } else {
    // Free mode — show marking prompt for manual feedback
    dom.fbBody.textContent = 'Paste your answer into Claude to get feedback, OR self-mark against the model answer below.';
    if (dom.markingSection) {
      const mp = buildMarkingPrompt(q, answer);
      dom.markingPromptBox.textContent = mp;
      dom.markingSection.classList.remove('hidden');
    }
    dom.selfRate.classList.remove('hidden');
  }

  dom.submitBtn.textContent = 'Submit Answer';
  dom.nextBtn.classList.remove('hidden');
  dom.feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── FREE MODE MARKING PROMPT ─────────────────────────────────────────────────
function copyMarkingPrompt() {
  if (!dom.markingPromptBox) return;
  navigator.clipboard.writeText(dom.markingPromptBox.textContent).then(() => {
    if (dom.copyMarkConfirm) {
      dom.copyMarkConfirm.classList.add('show');
      setTimeout(() => dom.copyMarkConfirm.classList.remove('show'), 2000);
    }
  });
}

function loadMarkingJson() {
  if (!dom.markJsonPaste) return;
  const raw = dom.markJsonPaste.value.trim();
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const fb = parsed.feedback || parsed.text || cleaned;
    dom.fbBody.textContent = fb;
    dom.markingSection.classList.add('hidden');
  } catch {
    // Just show the raw text
    dom.fbBody.textContent = raw;
    dom.markingSection.classList.add('hidden');
  }
}

// ─── RATING ───────────────────────────────────────────────────────────────────
window.rateAnswer = function(level, btn) {
  document.querySelectorAll('.rate-btn').forEach(b => b.className = 'rate-btn');
  const map = { good: 'g', partial: 'p', fail: 'f' };
  btn.className = `rate-btn ${map[level]}`;
  S.ratings[S.current] = level;
};

// ─── NEXT ─────────────────────────────────────────────────────────────────────
function nextQuestion() {
  const rating = S.ratings[S.current];
  if (!rating) {
    dom.selfRate.querySelector('p').textContent = '← Rate your answer first';
    dom.selfRate.querySelector('p').style.color = 'var(--accent2)';
    return;
  }
  if (rating === 'good') S.score += 2;
  if (rating === 'partial') S.score += 1;

  const dots = dom.progressDots.querySelectorAll('.dot');
  dots[S.current].classList.remove('current');
  dots[S.current].classList.add('done');
  S.current++;
  dom.scoreDisplay.innerHTML = `Score: <span>${S.score}</span>`;

  if (S.current >= S.totalQ) { showResults(); return; }
  dots[S.current].classList.add('current');
  loadQuestion(S.current);
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function showResults() {
  dom.quizWrap.classList.remove('active');
  dom.resultsScreen.classList.add('active');
  const max = S.totalQ * 2;
  const pct = Math.round((S.score / max) * 100);
  dom.scoreBig.textContent = `${S.score}/${max}`;
  const msgs = [[80,'🔥 Excellent — strong exam readiness'],[60,'✓ Good — a few areas to revisit'],[40,'⚠ Keep going — focus on the weak spots'],[0,'📚 Study mode — use model answers as revision notes']];
  dom.scoreMsg.textContent = msgs.find(([t]) => pct >= t)[1];

  dom.resultsGrid.innerHTML = '';
  S.questions.forEach((q, i) => {
    const r = S.ratings[i] || 'fail';
    const map = { good: ['g','✓ Got it (+2)'], partial: ['p','~ Partial (+1)'], fail: ['f','✗ Missed (+0)'] };
    const [cls, label] = map[r];
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `<div class="ri-topic">${q.topic}</div><div class="ri-paper">${q.paper||''}</div><div class="ri-verdict ${cls}">${label}</div>`;
    dom.resultsGrid.appendChild(div);
  });
}

window.retryQuiz = () => { dom.resultsScreen.classList.remove('active'); dom.setupSection.classList.remove('hidden'); };
window.retakeQuiz = () => { dom.resultsScreen.classList.remove('active'); startQuiz(); };

// ─── SELECT ALL / NONE ────────────────────────────────────────────────────────
document.addEventListener('selectAll', () => {
  S.selectedTopics = TOPICS.map(t => t.id);
  document.querySelectorAll('.topic-card').forEach(c => c.classList.add('selected'));
  updateStartBtn();
});
document.addEventListener('selectNone', () => {
  S.selectedTopics = [];
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  updateStartBtn();
});

// ─── FREE MODE FLOW VISIBILITY ────────────────────────────────────────────────
function showFreeModeFlow() {
  const ps = document.getElementById('promptSection');
  const pa = document.getElementById('pasteSection');
  if (ps) ps.style.display = 'block';
  if (pa) pa.style.display = 'block';
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
