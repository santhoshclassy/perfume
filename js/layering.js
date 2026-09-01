// Smell Me - Bespoke Fragrance Layering Studio
import { FRAGRANCES, LAYERING_COMBOS } from './data.js';
import { sound } from './audio.js';
import { cart } from './cart.js';
import { getParticleEngine } from './particles.js';

class FragranceLayeringStudio {
  constructor() {
    this.container = null;
    this.selectedBaseId = 'elixir-noir';
    this.selectedAccentId = 'rose-imperiale';
  }

  init() {
    this.container = document.getElementById('layering-studio-mount');
    if (!this.container) return;
    this.render();
  }

  render() {
    const basePerfume = FRAGRANCES.find(f => f.id === this.selectedBaseId) || FRAGRANCES[0];
    const accentPerfume = FRAGRANCES.find(f => f.id === this.selectedAccentId) || FRAGRANCES[2];

    // Find known combo or synthesize dynamic combo
    let combo = LAYERING_COMBOS.find(c => 
      (c.base === this.selectedBaseId && c.accent === this.selectedAccentId) ||
      (c.base === this.selectedAccentId && c.accent === this.selectedBaseId)
    );

    if (!combo) {
      combo = {
        title: `${basePerfume.name} × ${accentPerfume.name}`,
        harmonyScore: Math.floor(Math.random() * 8 + 90),
        accordType: `${basePerfume.familyLabel} & ${accentPerfume.familyLabel}`,
        description: `An avant-garde olfactory alchemy marrying the ${basePerfume.baseNotes[0]} depth with the vibrant ${accentPerfume.topNotes[0]} top accord.`,
        tags: ["Custom Alchemy", "High Sillage", "Unique Aura"]
      };
    }

    const bundleOriginalPrice = basePerfume.prices['50ml'] + accentPerfume.prices['50ml'];
    const bundleDiscountPrice = Math.round(bundleOriginalPrice * 0.85);

    this.container.innerHTML = `
      <div class="layering-card-glass">
        <div class="layering-selection-row">
          <!-- Base Flacon Picker -->
          <div class="layering-picker-col">
            <span class="picker-step-badge">01. Foundation Base (1-2 Sprays)</span>
            <div class="picker-bottle-preview">
              <img src="${basePerfume.image}" alt="${basePerfume.name}" id="layer-base-img" class="layer-flacon-img" />
              <div class="picker-details">
                <h4 class="picker-name">${basePerfume.name}</h4>
                <p class="picker-notes">${basePerfume.baseNotes.slice(0, 2).join(' • ')}</p>
              </div>
            </div>
            <select class="luxury-select" id="layer-base-select" aria-label="Select Foundation Base Fragrance">
              ${FRAGRANCES.filter(f => f.family !== 'set').map(f => `
                <option value="${f.id}" ${f.id === this.selectedBaseId ? 'selected' : ''}>
                  ${f.name} (${f.familyLabel})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Alchemy Symbol / Mixer Center -->
          <div class="layering-alchemy-center">
            <button type="button" class="alchemy-trigger-btn" id="btn-fuse-scents" title="Fuse and preview accord mist">
              <span class="alchemy-icon">⚗️</span>
              <span class="alchemy-label">Fuse Accords</span>
            </button>
            <div class="harmony-meter-pill">
              <span class="harmony-score">${combo.harmonyScore}%</span>
              <span class="harmony-text">Harmonic Synergy</span>
            </div>
          </div>

          <!-- Accent Flacon Picker -->
          <div class="layering-picker-col">
            <span class="picker-step-badge">02. Top Accent (1 Spray)</span>
            <div class="picker-bottle-preview">
              <img src="${accentPerfume.image}" alt="${accentPerfume.name}" id="layer-accent-img" class="layer-flacon-img" />
              <div class="picker-details">
                <h4 class="picker-name">${accentPerfume.name}</h4>
                <p class="picker-notes">${accentPerfume.topNotes.slice(0, 2).join(' • ')}</p>
              </div>
            </div>
            <select class="luxury-select" id="layer-accent-select" aria-label="Select Top Accent Fragrance">
              ${FRAGRANCES.filter(f => f.family !== 'set').map(f => `
                <option value="${f.id}" ${f.id === this.selectedAccentId ? 'selected' : ''}>
                  ${f.name} (${f.familyLabel})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Alchemy Result Synthesis Panel -->
        <div class="layering-synthesis-box">
          <div class="synthesis-header">
            <span class="synthesis-badge">Harmonized Accord</span>
            <h3 class="synthesis-title">${combo.title}</h3>
            <span class="synthesis-accord-type">${combo.accordType}</span>
          </div>
          <p class="synthesis-desc">${combo.description}</p>
          <div class="synthesis-tags">
            ${combo.tags.map(t => `<span class="synthesis-tag">✦ ${t}</span>`).join('')}
          </div>

          <div class="synthesis-cta-row">
            <div class="duo-pricing">
              <span class="duo-label">Layering Duo Special (50ml + 50ml)</span>
              <div class="price-strike-wrap">
                <span class="strike-price">$${bundleOriginalPrice}</span>
                <span class="current-price">$${bundleDiscountPrice}</span>
                <span class="save-badge">Save 15%</span>
              </div>
            </div>
            <button type="button" class="btn-primary" id="btn-add-duo">
              <span>Add Duo Set to Bag — $${bundleDiscountPrice}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindControls(basePerfume, accentPerfume, bundleDiscountPrice);
  }

  bindControls(basePerfume, accentPerfume, discountPrice) {
    const baseSelect = this.container.querySelector('#layer-base-select');
    const accentSelect = this.container.querySelector('#layer-accent-select');
    const fuseBtn = this.container.querySelector('#btn-fuse-scents');
    const addDuoBtn = this.container.querySelector('#btn-add-duo');

    if (baseSelect) {
      baseSelect.addEventListener('change', (e) => {
        sound.playTick();
        this.selectedBaseId = e.target.value;
        this.render();
      });
    }

    if (accentSelect) {
      accentSelect.addEventListener('change', (e) => {
        sound.playTick();
        this.selectedAccentId = e.target.value;
        this.render();
      });
    }

    if (fuseBtn) {
      fuseBtn.addEventListener('click', (e) => {
        sound.playSpritz();
        sound.playCrystalClink();
        const rect = fuseBtn.getBoundingClientRect();
        const pEngine = getParticleEngine();
        if (pEngine) {
          pEngine.triggerSpritzBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90, -Math.PI / 2, Math.PI);
        }
      });
    }

    if (addDuoBtn) {
      addDuoBtn.addEventListener('click', () => {
        cart.addItem(basePerfume, '50ml', 1, true);
        cart.addItem(accentPerfume, '50ml', 1, true);
        cart.openDrawer();
      });
    }
  }
}

export const layeringStudio = new FragranceLayeringStudio();
