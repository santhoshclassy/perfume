// Smell Me - Luxury Smooth Cursor & Trailing Aura Engine

class LuxuryCursor {
  constructor() {
    this.cursorDot = null;
    this.cursorRing = null;
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.isHovering = false;
    this.isClicking = false;
    this.isVisible = false;
    this.init();
  }

  init() {
    // Only enable on fine pointer devices (mouse/trackpad, not touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.createElements();
    this.bindEvents();
    this.render();
  }

  createElements() {
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'luxury-cursor-dot';

    this.cursorRing = document.createElement('div');
    this.cursorRing.className = 'luxury-cursor-ring';

    document.body.appendChild(this.cursorDot);
    document.body.appendChild(this.cursorRing);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
      if (!this.isVisible) {
        this.isVisible = true;
        this.cursorDot.style.opacity = '1';
        this.cursorRing.style.opacity = '1';
      }
    });

    window.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.cursorRing.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.cursorRing.classList.remove('clicking');
    });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.cursorDot.style.opacity = '0';
      this.cursorRing.style.opacity = '0';
    });

    // Detect hover over interactive elements
    const hoverSelectors = 'a, button, input, select, textarea, .card-tilt, .pyramid-note-pill, .sample-chip, [role="button"]';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelectors)) {
        this.isHovering = true;
        this.cursorRing.classList.add('hovering');
        this.cursorDot.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelectors)) {
        this.isHovering = false;
        this.cursorRing.classList.remove('hovering');
        this.cursorDot.classList.remove('hovering');
      }
    });
  }

  render() {
    if (this.isVisible) {
      // Smooth interpolation for the ring (lerp with 0.15 factor for silky lag)
      this.ringPos.x += (this.target.x - this.ringPos.x) * 0.15;
      this.ringPos.y += (this.target.y - this.ringPos.y) * 0.15;

      // Dot moves instantly
      this.cursorDot.style.transform = `translate3d(${this.target.x}px, ${this.target.y}px, 0)`;
      this.cursorRing.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;
    }

    requestAnimationFrame(() => this.render());
  }
}

export function initLuxuryCursor() {
  return new LuxuryCursor();
}
