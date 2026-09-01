// Smell Me - Ultra-Luminous Large Diamond Sparkle & Sensory Particle Engine

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.sparkles = [];
    this.bokehOrbs = [];
    this.sprayParticles = [];
    this.ripples = [];
    this.mistClouds = [];
    this.mouse = { x: -1000, y: -1000, active: false };
    this.width = 0;
    this.height = 0;
    this.maxSparkles = 95; // High-density luminous diamond sparkles
    this.maxBokeh = 32;     // Large prominent golden bokeh spheres
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Mouse tracking for particle interaction & sparkling trail
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;

      // Burst of bright diamond sparkles directly on mouse movement
      if (Math.random() < 0.7) {
        this.addCursorSparkle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Expanding Olfactory Golden Ripple & Sparkle Burst on click
    window.addEventListener('click', (e) => {
      this.triggerRipple(e.clientX, e.clientY, 480);
      this.triggerSparkleBurst(e.clientX, e.clientY, 16);
    });

    this.createSparkles();
    this.createBokehOrbs();
    this.createMistClouds();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Create prominent 4-point Diamond Sparkles
  createSparkles() {
    this.sparkles = [];
    for (let i = 0; i < this.maxSparkles; i++) {
      this.sparkles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        // Large sparkle size (14px to 38px ray radius!)
        size: Math.random() * 24 + 14,
        baseAlpha: Math.random() * 0.5 + 0.45,
        alpha: Math.random() * 0.5 + 0.45,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.5 - 0.18,
        pulseSpeed: Math.random() * 0.045 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        isStar: Math.random() > 0.2 // 80% are 4-point radiant diamond stars
      });
    }
  }

  // Create large soft floating Golden Bokeh Spheres
  createBokehOrbs() {
    this.bokehOrbs = [];
    for (let i = 0; i < this.maxBokeh; i++) {
      this.bokehOrbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 65 + 35, // 35px to 100px radius (70px-200px diameter!)
        baseAlpha: Math.random() * 0.3 + 0.18,
        alpha: Math.random() * 0.3 + 0.18,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.4 - 0.12,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        color: i % 3 === 0 ? 'rgba(230, 185, 60,' : (i % 3 === 1 ? 'rgba(255, 230, 150,' : 'rgba(245, 158, 11,')
      });
    }
  }

  createMistClouds() {
    this.mistClouds = [];
    for (let i = 0; i < 9; i++) {
      this.mistClouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 650 + 550, // 550px to 1200px giant mist volume!
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.3 - 0.1,
        alpha: Math.random() * 0.12 + 0.12,
        color: i % 3 === 0 ? 'rgba(212, 175, 55,' : (i % 3 === 1 ? 'rgba(245, 158, 11,' : 'rgba(215, 65, 95,')
      });
    }
  }

  // Draw a brilliant 4-Point Diamond Sparkle with Flare Streaks & Core
  drawDiamondSparkle(x, y, size, alpha, rotation = 0) {
    if (alpha <= 0.01) return;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // 1. Radiant Outer Glow Halo
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4.2);
    glowGrad.addColorStop(0, `rgba(255, 248, 220, ${alpha * 0.98})`);
    glowGrad.addColorStop(0.3, `rgba(235, 195, 120, ${alpha * 0.65})`);
    glowGrad.addColorStop(0.65, `rgba(212, 175, 55, ${alpha * 0.25})`);
    glowGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 4.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Horizontal & Vertical Anamorphic Lens Flare Rays
    ctx.fillStyle = `rgba(255, 250, 225, ${alpha * 0.92})`;
    
    // Horizontal flare
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 5.2, Math.max(1.8, size * 0.30), 0, 0, Math.PI * 2);
    ctx.fill();

    // Vertical flare
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(1.8, size * 0.30), size * 5.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Diagonal sub-flares (45 degrees)
    ctx.fillStyle = `rgba(245, 215, 145, ${alpha * 0.65})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 3.2, Math.max(1.2, size * 0.22), Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 3.2, Math.max(1.2, size * 0.22), -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Four-point Concave Star Core
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.1)})`;
    ctx.beginPath();
    const r = size * 2.2;
    const innerR = size * 0.38;
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, -innerR, innerR, 0);
    ctx.quadraticCurveTo(0, innerR, 0, r);
    ctx.quadraticCurveTo(0, innerR, -innerR, 0);
    ctx.quadraticCurveTo(0, -innerR, 0, -r);
    ctx.fill();

    // 4. Ultra-bright Pure White Central Light Hotspot
    ctx.fillStyle = `#ffffff`;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2.5, size * 0.45), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw glowing circular stardust
  drawRoundStardust(x, y, radius, alpha) {
    if (alpha <= 0.01) return;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 185, ${alpha})`;
    ctx.shadowBlur = radius * 6;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.98)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Large Golden Bokeh Orb
  drawBokehOrb(x, y, radius, alpha, color) {
    if (alpha <= 0.01) return;
    const ctx = this.ctx;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `${color} ${alpha * 1.2})`);
    grad.addColorStop(0.45, `${color} ${alpha * 0.65})`);
    grad.addColorStop(0.8, `${color} ${alpha * 0.2})`);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  addCursorSparkle(x, y) {
    for (let i = 0; i < 2; i++) {
      this.sprayParticles.push({
        x: x + (Math.random() - 0.5) * 44,
        y: y + (Math.random() - 0.5) * 44,
        vx: (Math.random() - 0.5) * 3.2,
        vy: (Math.random() - 0.5) * 3.2 - 1.0,
        size: Math.random() * 18 + 10, // Big visible cursor sparkles
        friction: 0.94,
        alpha: 0.98,
        maxLife: 42,
        life: 42,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.06
      });
    }
  }

  triggerSparkleBurst(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.sprayParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 26 + 14, // Huge burst sparkles
        friction: 0.93,
        alpha: 1.0,
        maxLife: 60,
        life: 60,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08
      });
    }
  }

  triggerRipple(x, y, maxRadius = 480, color = 'rgba(235, 195, 110,') {
    this.ripples.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: maxRadius,
      alpha: 0.95,
      speed: 5.4,
      color: color
    });
  }

  triggerSpritzBurst(originX, originY, count = 135, angleRad = -Math.PI / 4, spread = Math.PI / 2.5, color = 'rgba(255, 235, 165,') {
    for (let i = 0; i < count; i++) {
      const angle = angleRad + (Math.random() - 0.5) * spread;
      const speed = Math.random() * 15 + 5;
      const life = Math.random() * 70 + 45;

      this.sprayParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 20 + 8, // Oversized glittering mist particles
        friction: 0.94,
        alpha: Math.random() * 0.95 + 0.4,
        maxLife: life,
        life: life,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.06
      });
    }

    this.triggerRipple(originX, originY, 480, color);
    this.triggerSparkleBurst(originX, originY, 20);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Ambient Mist Clouds
    for (let i = 0; i < this.mistClouds.length; i++) {
      const mist = this.mistClouds[i];
      mist.x += mist.vx;
      mist.y += mist.vy;

      if (mist.y < -mist.radius) mist.y = this.height + mist.radius;
      if (mist.x < -mist.radius) mist.x = this.width + mist.radius;
      if (mist.x > this.width + mist.radius) mist.x = -mist.radius;

      const grad = this.ctx.createRadialGradient(mist.x, mist.y, 0, mist.x, mist.y, mist.radius);
      grad.addColorStop(0, `${mist.color} ${mist.alpha})`);
      grad.addColorStop(0.5, `${mist.color} ${mist.alpha * 0.6})`);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(mist.x, mist.y, mist.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Render Large Soft Golden Bokeh Orbs
    for (let i = 0; i < this.bokehOrbs.length; i++) {
      const b = this.bokehOrbs[i];
      b.pulsePhase += b.pulseSpeed;
      b.alpha = b.baseAlpha + Math.sin(b.pulsePhase) * 0.12;
      b.x += b.speedX;
      b.y += b.speedY;

      if (b.y < -b.radius) {
        b.y = this.height + b.radius;
        b.x = Math.random() * this.width;
      }
      if (b.x < -b.radius) b.x = this.width + b.radius;
      if (b.x > this.width + b.radius) b.x = -b.radius;

      this.drawBokehOrb(b.x, b.y, b.radius, b.alpha, b.color);
    }

    // 3. Render Olfactory Ripple Waves
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      const progress = r.radius / r.maxRadius;
      const currentAlpha = (1 - progress) * r.alpha;

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `${r.color} ${currentAlpha})`;
      this.ctx.lineWidth = Math.max(1.2, (1 - progress) * 4.0);
      this.ctx.shadowBlur = 16;
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      if (r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }

    // 4. Render Filament Threads between nearby sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      for (let j = i + 1; j < this.sparkles.length; j++) {
        const s1 = this.sparkles[i];
        const s2 = this.sparkles[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const lineAlpha = (1 - dist / 150) * 0.35 * Math.min(s1.alpha, s2.alpha);
          this.ctx.beginPath();
          this.ctx.moveTo(s1.x, s1.y);
          this.ctx.lineTo(s2.x, s2.y);
          this.ctx.strokeStyle = `rgba(255, 235, 170, ${lineAlpha})`;
          this.ctx.lineWidth = 1.4;
          this.ctx.stroke();
        }
      }
    }

    // 5. Render Large Radiant 4-Point Diamond Sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.pulsePhase += s.pulseSpeed;
      s.rotation += s.rotationSpeed;
      
      // Dynamic breathing brightness (sparkling twinkle)
      s.alpha = s.baseAlpha + Math.sin(s.pulsePhase) * 0.45;
      if (s.alpha < 0.1) s.alpha = 0.1;
      if (s.alpha > 1) s.alpha = 1;

      // Mouse proximity interaction (gentle deflection)
      if (this.mouse.active) {
        const dx = s.x - this.mouse.x;
        const dy = s.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170 && dist > 0) {
          const force = (170 - dist) / 170;
          s.x += (dx / dist) * force * 4.0;
          s.y += (dy / dist) * force * 4.0;
        }
      }

      s.x += s.speedX;
      s.y += s.speedY;

      if (s.y < -30) {
        s.y = this.height + 30;
        s.x = Math.random() * this.width;
      }
      if (s.x < -30) s.x = this.width + 30;
      if (s.x > this.width + 30) s.x = -30;

      if (s.isStar) {
        this.drawDiamondSparkle(s.x, s.y, s.size, s.alpha, s.rotation);
      } else {
        this.drawRoundStardust(s.x, s.y, s.size * 0.45, s.alpha);
      }
    }

    // 6. Render Sparkling Spray Particles & Burst Flashes
    for (let i = this.sprayParticles.length - 1; i >= 0; i--) {
      const p = this.sprayParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.life--;
      p.rotation += p.rotationSpeed || 0.02;

      const currentAlpha = (p.life / p.maxLife) * p.alpha;
      const curSize = p.size * (1 + (1 - p.life / p.maxLife) * 0.6);

      this.drawDiamondSparkle(p.x, p.y, curSize, currentAlpha, p.rotation);

      if (p.life <= 0) {
        this.sprayParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

let particlesInstance = null;
export function initParticles(canvasId = 'ambient-canvas') {
  if (!particlesInstance) {
    particlesInstance = new ParticleEngine(canvasId);
  }
  return particlesInstance;
}
export function getParticleEngine() {
  return particlesInstance;
}
