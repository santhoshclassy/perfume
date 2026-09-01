// Smell Me - Scent Finder Diagnostic Quiz Module
import { QUIZ_QUESTIONS, FRAGRANCES } from './data.js';
import { sound } from './audio.js';
import { getParticleEngine } from './particles.js';
import { cart } from './cart.js';

class ScentQuiz {
  constructor() {
    this.currentStep = 0;
    this.answers = {};
    this.scores = { woody: 0, floral: 0, fresh: 0, gourmand: 0 };
    this.matchedFragrance = null;
    this.modal = null;
    this.isOpen = false;
  }

  init() {
    this.modal = document.getElementById('quiz-modal');
    if (!this.modal) return;
    this.bindEvents();
  }

  bindEvents() {
    const openBtns = document.querySelectorAll('[data-action="open-quiz"]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    sound.playCrystalClink();
    this.currentStep = 0;
    this.answers = {};
    this.scores = { woody: 0, floral: 0, fresh: 0, gourmand: 0 };
    this.matchedFragrance = null;
    this.isOpen = true;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.renderStep();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  renderStep() {
    const content = this.modal.querySelector('.quiz-content-body');
    if (!content) return;

    if (this.currentStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[this.currentStep];
      const progress = ((this.currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

      content.innerHTML = `
        <div class="quiz-step-container">
          <div class="quiz-header">
            <span class="quiz-step-count">Question ${this.currentStep + 1} of ${QUIZ_QUESTIONS.length}</span>
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" style="width: ${progress}%"></div>
            </div>
            <h3 class="quiz-question-title">${q.title}</h3>
            <p class="quiz-question-subtitle">${q.subtitle}</p>
          </div>

          <div class="quiz-options-grid">
            ${q.options.map((opt, idx) => `
              <button type="button" class="quiz-option-card" data-opt-idx="${idx}">
                <span class="quiz-option-icon">${opt.icon}</span>
                <span class="quiz-option-label">${opt.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-footer">
            ${this.currentStep > 0 ? `<button type="button" class="quiz-back-btn" id="quiz-back">← Previous</button>` : `<span></span>`}
          </div>
        </div>
      `;

      // Bind option clicks
      content.querySelectorAll('.quiz-option-card').forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playTick();
          const idx = parseInt(btn.getAttribute('data-opt-idx'), 10);
          this.selectOption(q, q.options[idx]);
        });
      });

      const backBtn = content.querySelector('#quiz-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
          }
        });
      }
    } else {
      this.calculateResults();
    }
  }

  selectOption(question, option) {
    this.answers[question.id] = option;

    if (option.familyWeight) {
      for (const [fam, weight] of Object.entries(option.familyWeight)) {
        this.scores[fam] = (this.scores[fam] || 0) + weight;
      }
    }
    if (option.matchPerfume) {
      this.forcedMatch = option.matchPerfume;
    }

    this.currentStep++;
    this.renderStep();
  }

  calculateResults() {
    const content = this.modal.querySelector('.quiz-content-body');
    if (!content) return;

    content.innerHTML = `
      <div class="quiz-calculating">
        <div class="quiz-alchemy-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-core">✨</div>
        </div>
        <h3 class="alchemy-title">Synthesizing Your Olfactory Profile</h3>
        <p class="alchemy-sub">Harmonizing notes, sillage, and emotional resonance...</p>
      </div>
    `;

    setTimeout(() => {
      // Determine best match
      let bestPerfume = null;

      if (this.forcedMatch) {
        bestPerfume = FRAGRANCES.find(f => f.id === this.forcedMatch);
      }

      if (!bestPerfume) {
        // Find dominant family
        let topFamily = 'woody';
        let maxScore = -1;
        for (const [fam, score] of Object.entries(this.scores)) {
          if (score > maxScore) {
            maxScore = score;
            topFamily = fam;
          }
        }
        bestPerfume = FRAGRANCES.find(f => f.family === topFamily) || FRAGRANCES[0];
      }

      this.matchedFragrance = bestPerfume;
      this.renderResult(bestPerfume);
      sound.playCrystalClink();
    }, 1200);
  }

  renderResult(perfume) {
    const content = this.modal.querySelector('.quiz-content-body');
    if (!content) return;

    content.innerHTML = `
      <div class="quiz-result-container animate-fade-in">
        <div class="quiz-result-header">
          <span class="badge-gold">Bespoke Olfactory Match</span>
          <h2 class="result-title">Your Signature Scent is <span class="gold-text">${perfume.name}</span></h2>
          <p class="result-subtitle">${perfume.tagline}</p>
        </div>

        <div class="quiz-result-card">
          <div class="result-image-col">
            <div class="result-image-wrapper">
              <img src="${perfume.image}" alt="${perfume.name}" class="result-bottle-img" />
              <button type="button" class="btn-spray-test" id="quiz-spray-btn" title="Click to test spritz">
                <span>💨 Test Spritz</span>
              </button>
            </div>
          </div>
          <div class="result-info-col">
            <div class="result-specs-grid">
              <div class="spec-pill">
                <span class="label">Family</span>
                <span class="val">${perfume.familyLabel}</span>
              </div>
              <div class="spec-pill">
                <span class="label">Longevity</span>
                <span class="val">${perfume.longevity}</span>
              </div>
              <div class="spec-pill">
                <span class="label">Sillage</span>
                <span class="val">${perfume.sillage}</span>
              </div>
            </div>

            <div class="result-notes-section">
              <span class="notes-heading">Olfactory Signature:</span>
              <div class="notes-tags-row">
                ${[...perfume.topNotes.slice(0, 2), ...perfume.heartNotes.slice(0, 2), ...perfume.baseNotes.slice(0, 2)].map(note => `
                  <span class="note-pill">${note}</span>
                `).join('')}
              </div>
            </div>

            <p class="result-story">${perfume.story}</p>

            <div class="result-actions">
              <button type="button" class="btn-primary" id="quiz-add-cart">
                <span>Add 50ml to Bag — $${perfume.prices['50ml']}</span>
              </button>
              <button type="button" class="btn-secondary" id="quiz-retake">
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind spray test
    const sprayBtn = content.querySelector('#quiz-spray-btn');
    if (sprayBtn) {
      sprayBtn.addEventListener('click', (e) => {
        const rect = sprayBtn.getBoundingClientRect();
        sound.playSpritz();
        const pEngine = getParticleEngine();
        if (pEngine) {
          pEngine.triggerSpritzBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70, -Math.PI / 2, Math.PI / 3);
        }
      });
    }

    // Bind Add to Cart
    const addCartBtn = content.querySelector('#quiz-add-cart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        cart.addItem(perfume, '50ml');
        this.close();
      });
    }

    // Retake
    const retakeBtn = content.querySelector('#quiz-retake');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.open();
      });
    }
  }
}

export const quiz = new ScentQuiz();
