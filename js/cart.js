// Smell Me - Luxury Cart & Checkout Drawer Module
import { sound } from './audio.js';
import { FRAGRANCES } from './data.js';

class LuxuryCart {
  constructor() {
    this.items = [];
    this.freeSamples = [];
    this.giftWrap = false;
    this.discountCode = null;
    this.discountPercent = 0;
    this.discountAmount = 0;
    this.drawer = null;
    this.isOpen = false;
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('smellme_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.items = parsed.items || [];
        this.freeSamples = parsed.freeSamples || [];
        this.giftWrap = parsed.giftWrap || false;
        this.discountCode = parsed.discountCode || null;
        this.discountPercent = parsed.discountPercent || 0;
        this.discountAmount = parsed.discountAmount || 0;
      }
    } catch (e) {
      console.warn('Failed to load cart state', e);
      this.items = [];
    }
  }

  saveState() {
    try {
      localStorage.setItem('smellme_cart_v1', JSON.stringify({
        items: this.items,
        freeSamples: this.freeSamples,
        giftWrap: this.giftWrap,
        discountCode: this.discountCode,
        discountPercent: this.discountPercent,
        discountAmount: this.discountAmount
      }));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
    this.updateCartBadge();
  }

  init() {
    this.drawer = document.getElementById('cart-drawer');
    this.bindEvents();
    this.updateCartBadge();
  }

  bindEvents() {
    const openBtns = document.querySelectorAll('[data-action="open-cart"]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeDrawer());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeDrawer();
    });
  }

  openDrawer() {
    sound.playCrystalClink();
    this.isOpen = true;
    if (this.drawer) {
      this.drawer.classList.add('active');
    }
    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.renderDrawer();
  }

  closeDrawer() {
    this.isOpen = false;
    if (this.drawer) {
      this.drawer.classList.remove('active');
    }
    const backdrop = document.getElementById('cart-backdrop');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  addItem(fragrance, size = '50ml', quantity = 1, isDuoDiscount = false) {
    sound.playCartChime();
    let price = fragrance.prices[size] || 185;
    if (isDuoDiscount) {
      price = Math.round(price * 0.85);
    }

    const existingIndex = this.items.findIndex(item => item.id === fragrance.id && item.size === size);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: fragrance.id,
        name: fragrance.name,
        subtitle: fragrance.subtitle,
        size: size,
        price: price,
        image: fragrance.image,
        quantity: quantity
      });
    }

    this.saveState();
    this.openDrawer();
    this.showToast(`Added ${fragrance.name} (${size}) to your bag`);
  }

  removeItem(index) {
    sound.playTick();
    this.items.splice(index, 1);
    this.saveState();
    this.renderDrawer();
  }

  updateQuantity(index, delta) {
    sound.playTick();
    if (!this.items[index]) return;
    this.items[index].quantity += delta;
    if (this.items[index].quantity <= 0) {
      this.items.splice(index, 1);
    }
    this.saveState();
    this.renderDrawer();
  }

  toggleSample(fragranceId) {
    sound.playTick();
    const idx = this.freeSamples.indexOf(fragranceId);
    if (idx > -1) {
      this.freeSamples.splice(idx, 1);
    } else {
      if (this.freeSamples.length >= 2) {
        this.freeSamples.shift(); // Max 2 free samples
      }
      this.freeSamples.push(fragranceId);
    }
    this.saveState();
    this.renderDrawer();
  }

  applyCoupon(code) {
    sound.playTick();
    const clean = code.trim().toUpperCase();
    if (clean === 'SMELLME15' || clean === 'VIP15') {
      this.discountCode = clean;
      this.discountPercent = 15;
      this.discountAmount = 0;
      this.saveState();
      this.renderDrawer();
      this.showToast('15% VIP discount applied!');
      return true;
    } else if (clean === 'VIPLUXE') {
      this.discountCode = clean;
      this.discountPercent = 0;
      this.discountAmount = 30;
      this.saveState();
      this.renderDrawer();
      this.showToast('$30 Luxury credit applied!');
      return true;
    } else {
      this.showToast('Invalid promo code. Try "SMELLME15"');
      return false;
    }
  }

  removeCoupon() {
    this.discountCode = null;
    this.discountPercent = 0;
    this.discountAmount = 0;
    this.saveState();
    this.renderDrawer();
  }

  getSubtotal() {
    return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    let discount = 0;
    if (this.discountPercent > 0) {
      discount = (subtotal * this.discountPercent) / 100;
    } else if (this.discountAmount > 0) {
      discount = this.discountAmount;
    }
    const giftWrapCost = this.giftWrap ? 10 : 0;
    return Math.max(0, subtotal - discount + giftWrapCost);
  }

  getTotalCount() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  updateCartBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  renderDrawer() {
    const body = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-footer-mount');
    if (!body || !footer) return;

    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const freeShippingThreshold = 200;
    const shippingDiff = freeShippingThreshold - subtotal;
    const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    // Render Items
    if (this.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">✨</div>
          <h3 class="empty-title">Your Olfactory Bag is Empty</h3>
          <p class="empty-desc">Discover our collection of rare handcrafted perfumes and bespoke discovery sets.</p>
          <button type="button" class="btn-primary" id="btn-empty-explore">
            <span>Explore Fragrances</span>
          </button>
        </div>
      `;
      const exploreBtn = body.querySelector('#btn-empty-explore');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          this.closeDrawer();
          const target = document.getElementById('collection');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = `
      <!-- Free Shipping Progress -->
      <div class="shipping-progress-card">
        <div class="shipping-msg">
          ${shippingDiff <= 0 
            ? '<span>🎉 You have unlocked <strong>Complimentary Worldwide White-Glove Shipping</strong>!</span>' 
            : `<span>Add <strong>$${shippingDiff}</strong> more for Complimentary Global Express Shipping</span>`}
        </div>
        <div class="shipping-bar-track">
          <div class="shipping-bar-fill" style="width: ${shippingProgress}%"></div>
        </div>
      </div>

      <!-- Items List -->
      <div class="cart-items-list">
        ${this.items.map((item, idx) => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
            <div class="cart-item-details">
              <div class="cart-item-head">
                <h4 class="cart-item-title">${item.name}</h4>
                <button type="button" class="btn-remove-item" data-remove-idx="${idx}" title="Remove item">✕</button>
              </div>
              <span class="cart-item-size">${item.size} • ${item.subtitle}</span>
              <div class="cart-item-bottom">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn" data-qty-idx="${idx}" data-delta="-1">−</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button type="button" class="qty-btn" data-qty-idx="${idx}" data-delta="1">+</button>
                </div>
                <span class="cart-item-price">$${item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Complimentary Samples Selector -->
      <div class="free-samples-section">
        <div class="samples-header">
          <span class="samples-title">Select 2 Free Deluxe 2ml Samples:</span>
          <span class="samples-count">${this.freeSamples.length}/2 Selected</span>
        </div>
        <div class="samples-chips-grid">
          ${FRAGRANCES.filter(f => f.family !== 'set').map(f => {
            const isSelected = this.freeSamples.includes(f.id);
            return `
              <button type="button" class="sample-chip ${isSelected ? 'selected' : ''}" data-sample-id="${f.id}">
                <span>${isSelected ? '✓ ' : '+ '}${f.name}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Gift Wrap Toggle -->
      <div class="gift-wrap-card">
        <label class="gift-wrap-label">
          <input type="checkbox" id="cart-gift-wrap-toggle" ${this.giftWrap ? 'checked' : ''} />
          <div class="gift-wrap-text">
            <strong>Bespoke Gifting Box & Wax Seal (+$10)</strong>
            <span>Hand-tied satin ribbon, velvet pouch, and embossed card</span>
          </div>
        </label>
      </div>
    `;

    // Footer with Promo Code and Checkout
    footer.innerHTML = `
      <div class="cart-summary-box">
        <!-- Promo code row -->
        <div class="promo-input-row">
          ${this.discountCode ? `
            <div class="applied-coupon-pill">
              <span>Code: <strong>${this.discountCode}</strong></span>
              <button type="button" id="btn-remove-coupon">Remove</button>
            </div>
          ` : `
            <input type="text" id="coupon-input" placeholder="Promo code (e.g. SMELLME15)" />
            <button type="button" class="btn-apply-coupon" id="btn-apply-coupon">Apply</button>
          `}
        </div>

        <div class="summary-lines">
          <div class="summary-line">
            <span>Subtotal</span>
            <span>$${subtotal}</span>
          </div>
          ${this.discountPercent > 0 ? `
            <div class="summary-line discount">
              <span>VIP Discount (${this.discountPercent}%)</span>
              <span>-$${Math.round((subtotal * this.discountPercent) / 100)}</span>
            </div>
          ` : ''}
          ${this.discountAmount > 0 ? `
            <div class="summary-line discount">
              <span>Luxury Credit</span>
              <span>-$${this.discountAmount}</span>
            </div>
          ` : ''}
          ${this.giftWrap ? `
            <div class="summary-line">
              <span>Bespoke Gifting Box</span>
              <span>+$10</span>
            </div>
          ` : ''}
          <div class="summary-line">
            <span>Shipping</span>
            <span>${shippingDiff <= 0 ? 'Complimentary' : '$15 (Free over $200)'}</span>
          </div>
          <div class="summary-line total">
            <span>Total</span>
            <span class="total-amount">$${total}</span>
          </div>
        </div>

        <button type="button" class="btn-primary btn-checkout" id="btn-trigger-checkout">
          <span>Proceed to Luxury Checkout — $${total}</span>
        </button>
        <p class="checkout-guarantee">🔒 256-Bit Encrypted • 30-Day Olfactory Satisfaction Guarantee</p>
      </div>
    `;

    this.bindDrawerActions();
  }

  bindDrawerActions() {
    // Remove buttons
    document.querySelectorAll('[data-remove-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-remove-idx'), 10);
        this.removeItem(idx);
      });
    });

    // Quantity buttons
    document.querySelectorAll('[data-qty-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-qty-idx'), 10);
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        this.updateQuantity(idx, delta);
      });
    });

    // Sample chips
    document.querySelectorAll('[data-sample-id]').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-sample-id');
        this.toggleSample(id);
      });
    });

    // Gift wrap toggle
    const giftWrapInput = document.getElementById('cart-gift-wrap-toggle');
    if (giftWrapInput) {
      giftWrapInput.addEventListener('change', (e) => {
        this.giftWrap = e.target.checked;
        this.saveState();
        this.renderDrawer();
      });
    }

    // Apply Coupon
    const applyCouponBtn = document.getElementById('btn-apply-coupon');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', () => {
        const input = document.getElementById('coupon-input');
        if (input && input.value) {
          this.applyCoupon(input.value);
        }
      });
    }

    // Remove Coupon
    const removeCouponBtn = document.getElementById('btn-remove-coupon');
    if (removeCouponBtn) {
      removeCouponBtn.addEventListener('click', () => {
        this.removeCoupon();
      });
    }

    // Checkout Modal Trigger
    const checkoutBtn = document.getElementById('btn-trigger-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.openCheckoutModal();
      });
    }
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    sound.playCrystalClink();
    modal.classList.add('active');
    this.closeDrawer();

    const checkoutBody = modal.querySelector('.checkout-modal-body');
    const total = this.getTotal();

    checkoutBody.innerHTML = `
      <div class="checkout-form-container">
        <h3 class="form-title">Complete Your Acquisition</h3>
        <p class="form-sub">Bespoke order total: <strong>$${total}</strong></p>

        <form id="express-checkout-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Full Name</label>
              <input type="text" required placeholder="Lord / Lady / Full Name" value="Elena Rostova" />
            </div>
            <div class="form-group full">
              <label>Email for Tracking & Certificate of Authenticity</label>
              <input type="email" required placeholder="you@luxury.com" value="elena.rostova@parfum.fr" />
            </div>
            <div class="form-group full">
              <label>Delivery Address</label>
              <input type="text" required placeholder="Rue du Faubourg Saint-Honoré" value="18 Place Vendôme, Suite 402" />
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" required placeholder="Paris" value="Paris" />
            </div>
            <div class="form-group">
              <label>Postal Code</label>
              <input type="text" required placeholder="75001" value="75001" />
            </div>
          </div>

          <div class="payment-method-box">
            <span class="payment-label">Payment Security:</span>
            <div class="payment-badges">
              <span>💳 Apple Pay / Visa Black</span>
              <span>🔒 Encrypted Vault</span>
            </div>
          </div>

          <button type="submit" class="btn-primary btn-full-submit" id="btn-submit-order">
            <span>Authorize & Dispatch Order — $${total}</span>
          </button>
        </form>
      </div>
    `;

    const form = checkoutBody.querySelector('#express-checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playCartChime();
        checkoutBody.innerHTML = `
          <div class="order-success-card animate-fade-in">
            <div class="success-icon">⚜️</div>
            <h2 class="success-title">Order Confirmed</h2>
            <p class="success-ref">Acquisition Ref: <strong>#SM-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
            <p class="success-msg">Your hand-bottled fragrance is being prepared by our master parfumeurs in Grasse. An engraved certificate of authenticity and tracking details have been sent to your email.</p>
            <button type="button" class="btn-primary" id="btn-finish-order">
              <span>Return to Smell Me House</span>
            </button>
          </div>
        `;
        this.items = [];
        this.freeSamples = [];
        this.saveState();

        const finishBtn = checkoutBody.querySelector('#btn-finish-order');
        if (finishBtn) {
          finishBtn.addEventListener('click', () => {
            modal.classList.remove('active');
          });
        }
      });
    }

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active');
    }
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }
}

export const cart = new LuxuryCart();
