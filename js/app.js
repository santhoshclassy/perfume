// Smell Me - Main Application Coordinator
import { FRAGRANCES, SCENT_FAMILIES, PYRAMID_NOTES, REVIEWS } from './data.js';
import { sound } from './audio.js';
import { initParticles, getParticleEngine } from './particles.js';
import { initLuxuryCursor } from './cursor.js';
import { quiz } from './quiz.js';
import { layeringStudio } from './layering.js';
import { cart } from './cart.js';

class App {
  constructor() {
    this.currentFamilyFilter = 'all';
    this.activeNoteFilter = null;
    this.wishlist = JSON.parse(localStorage.getItem('smellme_wishlist') || '[]');
  }

  init() {
    initParticles('ambient-canvas');
    initLuxuryCursor();
    sound.init();
    cart.init();
    quiz.init();
    layeringStudio.init();

    this.renderCatalog();
    this.renderPyramid();
    this.renderReviews();
    this.bindGlobalEvents();
    this.bindHeroInteractions();
    this.initCardTiltPhysics();
    this.initScrollReveal();
    this.updateSoundToggleUI();
  }

  bindGlobalEvents() {
    // Header Scroll State
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // Sound Toggle
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        this.updateSoundToggleUI(isMuted);
      });
    }

    // Navigation Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          sound.playTick();
          target.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('mobile-nav')?.classList.remove('active');
        }
      });
    });

    // Mobile Nav Toggle
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        sound.playTick();
        mobileNav.classList.toggle('active');
      });
    }

    // VIP Club Newsletter form
    const vipForm = document.getElementById('vip-vault-form');
    if (vipForm) {
      vipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playCartChime();
        const container = vipForm.parentElement;
        container.innerHTML = `
          <div class="vip-success-box animate-fade-in">
            <span class="vip-key">🗝️</span>
            <h4>Welcome to the Private Circle</h4>
            <p>Your 15% VIP Access Pass has been granted. Use code <strong class="gold-text">SMELLME15</strong> at checkout.</p>
          </div>
        `;
        cart.applyCoupon('SMELLME15');
      });
    }

    // Modal Close Backdrop Bindings
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      }
    });
  }

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
  }

  updateSoundToggleUI(isMuted = sound.isMuted) {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;
    if (isMuted) {
      btn.innerHTML = `<span class="sound-icon">🔇</span> <span class="sound-text">Sound Off</span>`;
      btn.classList.add('muted');
    } else {
      btn.innerHTML = `<span class="sound-icon">🔊</span> <span class="sound-text">Sound On</span>`;
      btn.classList.remove('muted');
    }
  }

  bindHeroInteractions() {
    const heroSprayBtn = document.getElementById('hero-spray-trigger');
    const heroBottleWrap = document.getElementById('hero-bottle-wrap');

    if (heroSprayBtn) {
      heroSprayBtn.addEventListener('click', (e) => {
        sound.playSpritz();
        sound.playCrystalClink();
        const rect = heroSprayBtn.getBoundingClientRect();
        const pEngine = getParticleEngine();
        if (pEngine) {
          pEngine.triggerSpritzBurst(rect.left + 50, rect.top - 20, 110, -Math.PI / 3, Math.PI / 2.5);
        }

        if (heroBottleWrap) {
          heroBottleWrap.classList.add('bottle-spraying');
          setTimeout(() => heroBottleWrap.classList.remove('bottle-spraying'), 800);
        }
      });
    }

    // Hero 3D Parallax Tilt with subtle damping
    const heroCard = document.getElementById('hero-stage');
    if (heroCard && window.innerWidth > 768) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 16;
        const rotateY = (x / rect.width) * 16;

        const bottle = document.getElementById('hero-3d-bottle');
        if (bottle) {
          bottle.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        }
      });

      heroCard.addEventListener('mouseleave', () => {
        const bottle = document.getElementById('hero-3d-bottle');
        if (bottle) {
          bottle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      });
    }
  }

  renderCatalog() {
    const filterMount = document.getElementById('category-tabs-mount');
    const gridMount = document.getElementById('fragrance-grid-mount');
    if (!filterMount || !gridMount) return;

    // Render Filter Tabs
    filterMount.innerHTML = SCENT_FAMILIES.map(fam => `
      <button type="button" class="category-pill ${fam.id === this.currentFamilyFilter ? 'active' : ''}" data-family="${fam.id}">
        <span class="family-icon">${fam.icon}</span>
        <span class="family-label">${fam.label}</span>
      </button>
    `).join('');

    filterMount.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playTick();
        this.currentFamilyFilter = btn.getAttribute('data-family');
        this.activeNoteFilter = null;
        this.renderCatalog();
      });
    });

    // Filter Fragrances
    let items = FRAGRANCES;
    if (this.currentFamilyFilter !== 'all') {
      items = items.filter(f => f.family === this.currentFamilyFilter);
    }
    if (this.activeNoteFilter) {
      items = items.filter(f => 
        f.topNotes.includes(this.activeNoteFilter) || 
        f.heartNotes.includes(this.activeNoteFilter) || 
        f.baseNotes.includes(this.activeNoteFilter)
      );
    }

    // Render Product Cards with stagger animations
    gridMount.innerHTML = items.map((perfume, index) => {
      const isWishlisted = this.wishlist.includes(perfume.id);
      const staggerClass = `stagger-${(index % 4) + 1}`;
      return `
        <article class="luxury-product-card card-tilt reveal-on-scroll ${staggerClass}" data-fragrance-id="${perfume.id}" style="--card-accent: ${perfume.accentColor}; --card-glow: ${perfume.glowColor}">
          <div class="card-glass-glow"></div>
          
          <div class="card-media-wrap">
            ${perfume.badge ? `<span class="card-badge">${perfume.badge}</span>` : ''}
            <button type="button" class="btn-wishlist ${isWishlisted ? 'favorited' : ''}" data-wishlist-id="${perfume.id}" title="Add to Private Wishlist">
              <span class="heart-icon">♥</span>
            </button>
            <img src="${perfume.image}" alt="${perfume.name}" class="product-card-img" loading="lazy" />
            
            <div class="card-spray-overlay">
              <button type="button" class="btn-card-spritz" data-spritz-id="${perfume.id}" title="Spritz tester">
                <span>💨 Spritz</span>
              </button>
              <button type="button" class="btn-card-quickview" data-quickview-id="${perfume.id}">
                <span>Quick View</span>
              </button>
            </div>
          </div>

          <div class="card-content">
            <div class="card-family-tag">
              <span>${perfume.familyLabel}</span>
              <div class="card-rating">
                <span class="star">★</span>
                <span>${perfume.rating}</span>
                <span class="rev-count">(${perfume.reviewsCount})</span>
              </div>
            </div>

            <h3 class="card-title">${perfume.name}</h3>
            <p class="card-subtitle">${perfume.subtitle}</p>
            <p class="card-tagline">${perfume.tagline}</p>

            <div class="card-notes-chips">
              ${perfume.topNotes.slice(0, 2).map(n => `<span class="note-chip">${n}</span>`).join('')}
              <span class="note-chip note-more">+${perfume.heartNotes.length + perfume.baseNotes.length} notes</span>
            </div>

            <!-- Size Selector & Price -->
            <div class="card-purchase-row">
              <div class="size-radio-group" data-perfume-card-id="${perfume.id}">
                <button type="button" class="size-btn active" data-size="50ml">50ml</button>
                <button type="button" class="size-btn" data-size="100ml">100ml</button>
                <button type="button" class="size-btn" data-size="sample">2ml Vial</button>
              </div>
              <div class="card-price-wrap">
                <span class="card-price" id="card-price-${perfume.id}">$${perfume.prices['50ml']}</span>
              </div>
            </div>

            <button type="button" class="btn-primary btn-add-bag" data-bag-id="${perfume.id}">
              <span>Add to Bag</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    this.bindCardEvents();
    this.initScrollReveal();
  }

  bindCardEvents() {
    // Size switchers
    document.querySelectorAll('.size-radio-group').forEach(group => {
      const perfumeId = group.getAttribute('data-perfume-card-id');
      const perfume = FRAGRANCES.find(f => f.id === perfumeId);
      if (!perfume) return;

      const priceElem = document.getElementById(`card-price-${perfumeId}`);
      const buttons = group.querySelectorAll('.size-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playTick();
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const size = btn.getAttribute('data-size');
          if (priceElem) {
            priceElem.textContent = `$${perfume.prices[size]}`;
          }
        });
      });
    });

    // Add to bag
    document.querySelectorAll('[data-bag-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const perfumeId = btn.getAttribute('data-bag-id');
        const perfume = FRAGRANCES.find(f => f.id === perfumeId);
        if (!perfume) return;

        const sizeGroup = document.querySelector(`[data-perfume-card-id="${perfumeId}"]`);
        const activeSizeBtn = sizeGroup?.querySelector('.size-btn.active');
        const size = activeSizeBtn ? activeSizeBtn.getAttribute('data-size') : '50ml';

        cart.addItem(perfume, size);
      });
    });

    // Quick View
    document.querySelectorAll('[data-quickview-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-quickview-id');
        this.openQuickView(id);
      });
    });

    // Spritz tester on card
    document.querySelectorAll('[data-spritz-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playSpritz();
        const rect = btn.getBoundingClientRect();
        const pEngine = getParticleEngine();
        if (pEngine) {
          pEngine.triggerSpritzBurst(rect.left + rect.width / 2, rect.top, 70, -Math.PI / 2, Math.PI / 3);
        }
      });
    });

    // Wishlist Toggle
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playTick();
        const id = btn.getAttribute('data-wishlist-id');
        const idx = this.wishlist.indexOf(id);
        if (idx > -1) {
          this.wishlist.splice(idx, 1);
          btn.classList.remove('favorited');
          cart.showToast('Removed from Private Vault Wishlist');
        } else {
          this.wishlist.push(id);
          btn.classList.add('favorited');
          cart.showToast('Added to Private Vault Wishlist');
        }
        localStorage.setItem('smellme_wishlist', JSON.stringify(this.wishlist));
      });
    });
  }

  openQuickView(fragranceId) {
    const perfume = FRAGRANCES.find(f => f.id === fragranceId);
    if (!perfume) return;
    sound.playCrystalClink();

    const modal = document.getElementById('quickview-modal');
    if (!modal) return;

    const body = modal.querySelector('.quickview-modal-body');
    body.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-image-col">
          <div class="qv-img-container">
            <img src="${perfume.image}" alt="${perfume.name}" class="qv-bottle-img" />
            <button type="button" class="btn-spray-test" id="qv-spritz-btn">
              <span>💨 Test Spritz Mist</span>
            </button>
          </div>
        </div>

        <div class="quickview-info-col">
          <span class="qv-badge">${perfume.familyLabel} • ${perfume.subtitle}</span>
          <h2 class="qv-title">${perfume.name}</h2>
          <div class="qv-rating-row">
            <span class="stars">★★★★★</span>
            <span class="rating-text">${perfume.rating} / 5.0 (${perfume.reviewsCount} verified connoisseurs)</span>
          </div>

          <p class="qv-tagline">"${perfume.tagline}"</p>
          <p class="qv-story">${perfume.story}</p>

          <!-- Olfactory Pyramid Breakdown -->
          <div class="qv-pyramid-breakdown">
            <div class="qv-pyramid-row">
              <span class="note-type">Top Notes (0-30 mins):</span>
              <span class="note-values">${perfume.topNotes.join(', ')}</span>
            </div>
            <div class="qv-pyramid-row">
              <span class="note-type">Heart Notes (2-6 hrs):</span>
              <span class="note-values">${perfume.heartNotes.join(', ')}</span>
            </div>
            <div class="qv-pyramid-row">
              <span class="note-type">Base Notes (8-14+ hrs):</span>
              <span class="note-values">${perfume.baseNotes.join(', ')}</span>
            </div>
          </div>

          <!-- Gauges -->
          <div class="qv-gauges-grid">
            <div class="gauge-card">
              <span class="gauge-label">Longevity</span>
              <span class="gauge-val">${perfume.longevity}</span>
            </div>
            <div class="gauge-card">
              <span class="gauge-label">Sillage Aura</span>
              <span class="gauge-val">${perfume.sillage}</span>
            </div>
            <div class="gauge-card">
              <span class="gauge-label">Concentration</span>
              <span class="gauge-val">Extrait (30% Oils)</span>
            </div>
          </div>

          <!-- Size selector & Add to bag -->
          <div class="qv-actions-box">
            <div class="qv-size-selector">
              <label>Select Presentation Size:</label>
              <div class="qv-sizes-row">
                <button type="button" class="qv-size-chip active" data-qv-size="50ml">50ml — $${perfume.prices['50ml']}</button>
                <button type="button" class="qv-size-chip" data-qv-size="100ml">100ml — $${perfume.prices['100ml']}</button>
                <button type="button" class="qv-size-chip" data-qv-size="sample">2ml Discovery — $${perfume.prices['sample']}</button>
              </div>
            </div>

            <button type="button" class="btn-primary btn-qv-add" id="qv-add-btn">
              <span>Acquire ${perfume.name} (50ml) — $${perfume.prices['50ml']}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    let selectedSize = '50ml';
    const sizeChips = body.querySelectorAll('.qv-size-chip');
    const addBtn = body.querySelector('#qv-add-btn');

    sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playTick();
        sizeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedSize = chip.getAttribute('data-qv-size');
        const price = perfume.prices[selectedSize];
        addBtn.innerHTML = `<span>Acquire ${perfume.name} (${selectedSize}) — $${price}</span>`;
      });
    });

    addBtn.addEventListener('click', () => {
      cart.addItem(perfume, selectedSize);
      modal.classList.remove('active');
    });

    const spritzBtn = body.querySelector('#qv-spritz-btn');
    if (spritzBtn) {
      spritzBtn.addEventListener('click', () => {
        sound.playSpritz();
        const rect = spritzBtn.getBoundingClientRect();
        const pEngine = getParticleEngine();
        if (pEngine) {
          pEngine.triggerSpritzBurst(rect.left + rect.width / 2, rect.top, 70, -Math.PI / 2, Math.PI / 2.5);
        }
      });
    }

    modal.classList.add('active');
  }

  renderPyramid() {
    const mount = document.getElementById('olfactory-pyramid-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="pyramid-interactive-wrapper">
        <div class="pyramid-tier top-tier reveal-on-scroll stagger-1">
          <div class="tier-info">
            <span class="tier-badge">Tier 01</span>
            <h4 class="tier-name">Top Notes (Opening Accord)</h4>
            <p class="tier-lifespan">First 15–30 minutes • Immediate impression & sparkling freshness</p>
          </div>
          <div class="tier-notes-flex">
            ${PYRAMID_NOTES.top.map(n => `
              <button type="button" class="pyramid-note-pill" data-pyramid-note="${n.name}" data-note-origin="${n.origin}" data-note-char="${n.character}" data-note-perfumes='${JSON.stringify(n.perfumes)}'>
                <span class="note-name">${n.name}</span>
                <span class="note-origin">${n.origin}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pyramid-tier heart-tier reveal-on-scroll stagger-2">
          <div class="tier-info">
            <span class="tier-badge">Tier 02</span>
            <h4 class="tier-name">Heart Notes (The Olfactory Soul)</h4>
            <p class="tier-lifespan">2 to 6 hours • The harmonic signature & floral/wood core</p>
          </div>
          <div class="tier-notes-flex">
            ${PYRAMID_NOTES.heart.map(n => `
              <button type="button" class="pyramid-note-pill" data-pyramid-note="${n.name}" data-note-origin="${n.origin}" data-note-char="${n.character}" data-note-perfumes='${JSON.stringify(n.perfumes)}'>
                <span class="note-name">${n.name}</span>
                <span class="note-origin">${n.origin}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pyramid-tier base-tier reveal-on-scroll stagger-3">
          <div class="tier-info">
            <span class="tier-badge">Tier 03</span>
            <h4 class="tier-name">Base Notes (Enduring Legacy)</h4>
            <p class="tier-lifespan">8 to 16+ hours • Deep resins, prized woods, and skin intimacy</p>
          </div>
          <div class="tier-notes-flex">
            ${PYRAMID_NOTES.base.map(n => `
              <button type="button" class="pyramid-note-pill" data-pyramid-note="${n.name}" data-note-origin="${n.origin}" data-note-char="${n.character}" data-note-perfumes='${JSON.stringify(n.perfumes)}'>
                <span class="note-name">${n.name}</span>
                <span class="note-origin">${n.origin}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Note Detail Drawer Popup on click -->
        <div class="pyramid-detail-bar" id="pyramid-detail-bar" style="display: none;">
          <div class="detail-content">
            <span class="detail-note-title" id="pyramid-selected-note-title">Damask Rose</span>
            <span class="detail-note-char" id="pyramid-selected-note-char">Velvety, deep floral, seductive</span>
            <div class="detail-perfumes-links" id="pyramid-perfumes-links"></div>
          </div>
          <button type="button" class="btn-close-pyramid-bar" id="btn-close-pyramid-bar">✕</button>
        </div>
      </div>
    `;

    mount.querySelectorAll('.pyramid-note-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sound.playTick();
        mount.querySelectorAll('.pyramid-note-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');

        const name = pill.getAttribute('data-pyramid-note');
        const char = pill.getAttribute('data-note-char');
        const perfumes = JSON.parse(pill.getAttribute('data-note-perfumes') || '[]');

        const detailBar = document.getElementById('pyramid-detail-bar');
        const titleElem = document.getElementById('pyramid-selected-note-title');
        const charElem = document.getElementById('pyramid-selected-note-char');
        const linksElem = document.getElementById('pyramid-perfumes-links');

        if (detailBar && titleElem && charElem && linksElem) {
          titleElem.textContent = `${name} (${pill.getAttribute('data-note-origin')})`;
          charElem.textContent = char;

          linksElem.innerHTML = `
            <span class="featuring-label">Featured in Smell Me Creations:</span>
            ${perfumes.map(pId => {
              const p = FRAGRANCES.find(f => f.id === pId);
              return p ? `<button type="button" class="pyramid-fragrance-tag" data-goto-fragrance="${p.id}">${p.name} →</button>` : '';
            }).join('')}
          `;

          linksElem.querySelectorAll('[data-goto-fragrance]').forEach(btn => {
            btn.addEventListener('click', () => {
              const pId = btn.getAttribute('data-goto-fragrance');
              this.openQuickView(pId);
            });
          });

          detailBar.style.display = 'flex';
          detailBar.classList.add('animate-slide-up');
        }
      });
    });

    const closePyramidBtn = mount.querySelector('#btn-close-pyramid-bar');
    if (closePyramidBtn) {
      closePyramidBtn.addEventListener('click', () => {
        const detailBar = document.getElementById('pyramid-detail-bar');
        if (detailBar) detailBar.style.display = 'none';
        mount.querySelectorAll('.pyramid-note-pill').forEach(p => p.classList.remove('selected'));
      });
    }
  }

  renderReviews() {
    const mount = document.getElementById('reviews-slider-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="reviews-track-grid">
        ${REVIEWS.map((r, idx) => `
          <div class="luxury-review-card reveal-on-scroll stagger-${idx + 1}">
            <div class="review-head">
              <div class="review-stars">★★★★★</div>
              <span class="review-date">${r.date}</span>
            </div>
            <h4 class="review-title">"${r.title}"</h4>
            <p class="review-comment">${r.comment}</p>
            <div class="review-meta">
              <div class="reviewer-info">
                <span class="reviewer-name">${r.name}</span>
                <span class="reviewer-city">${r.city} • <span class="verified-badge">✓ Verified Acquisition</span></span>
              </div>
              <span class="review-fragrance-pill">${r.fragrance}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  initCardTiltPhysics() {
    if (window.innerWidth < 1024) return;

    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.card-tilt');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isHovered = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );

        if (isHovered) {
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / rect.height) * 10;
          const rotateY = (x / rect.width) * 10;

          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
          const glow = card.querySelector('.card-glass-glow');
          if (glow) {
            glow.style.opacity = '1';
            glow.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.18), transparent 70%)`;
          }
        } else {
          card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
          const glow = card.querySelector('.card-glass-glow');
          if (glow) glow.style.opacity = '0';
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
