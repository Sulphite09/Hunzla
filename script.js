/* ─────────────────────────────────────────
   script.js  —  Will You Be Mine?
───────────────────────────────────────── */

/* ══════════════════════════════════════
   NO BUTTON — runs away from the cursor
══════════════════════════════════════ */
const noBtn    = document.getElementById('btnNo');
const btnGroup = document.getElementById('btnGroup');
// Absolutely position inside the btn-group
noBtn.style.position = 'absolute';
noBtn.style.left = '0px';
noBtn.style.top  = '0px';

noBtn.addEventListener('mouseenter', escapeNo);
noBtn.addEventListener('touchstart',  escapeNo, { passive: true });

function escapeNo() {
  const groupWidth  = btnGroup.offsetWidth;
  const btnWidth    = noBtn.offsetWidth;
  const vertRange   = 120; // how far it can move up/down in px

  let newX, newY;

  // Keep trying until the new position is away from the Yes button (center area)
  do {
    newX = Math.random() * (groupWidth - btnWidth);
    newY = (Math.random() * vertRange) - vertRange / 2;
  } while (Math.abs(newX - groupWidth / 2) < 90 && Math.abs(newY) < 30);

  noBtn.style.left = newX + 'px';
  noBtn.style.top  = newY + 'px';
}


/* ══════════════════════════════════════
   YES BUTTON — show page 2
══════════════════════════════════════ */
function showYes() {
  // Hide page 1
  document.getElementById('page1').style.display = 'none';

  // Show page 2
  const page2 = document.getElementById('page2');
  page2.style.display = 'block';

  // Fire confetti
  spawnConfetti();

  // Shift background to golden yellow
  const bg = document.getElementById('bg');
  bg.style.background     = 'linear-gradient(135deg, #f9a825, #ffcc02, #ff8f00, #ffd54f, #ffb300)';
  bg.style.backgroundSize = '400% 400%';
  // keep the animation going by re-applying the class trick via inline style
  bg.style.animation      = 'gradientFlow 6s ease infinite';

  // Ensure the preloaded video is visible and playing
  const videoEl = document.getElementById('videoEl');
  if (videoEl) {
    videoEl.style.display = 'block';
    // Attempt to play; ignore promise rejection for autoplay policies
    videoEl.play().catch(() => {});
  }
}


/* ══════════════════════════════════════
   VIDEO UPLOAD
══════════════════════════════════════ */
// Upload handler removed — page uses a single preloaded video (video.mp4).


/* ══════════════════════════════════════
   CONFETTI BURST
══════════════════════════════════════ */
function spawnConfetti() {
  const colors = [
    '#ff4081', '#fff176', '#80deea',
    '#f48fb1', '#ffffff', '#ffcc02',
    '#69f0ae', '#ff80ab'
  ];

  for (let i = 0; i < 100; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';

    const size  = 6 + Math.random() * 10;
    const delay = Math.random() * 1.5;
    const dur   = 2 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? '50%' : '2px';

    el.style.cssText = `
      left:              ${Math.random() * 100}vw;
      top:               -10px;
      width:             ${size}px;
      height:            ${size}px;
      background:        ${color};
      border-radius:     ${shape};
      animation-duration:  ${dur}s;
      animation-delay:     ${delay}s;
    `;

    document.body.appendChild(el);

    // Clean up after animation ends
    setTimeout(() => el.remove(), (dur + delay + 0.5) * 1000);
  }
}


/* ══════════════════════════════════════
   PARTICLE BACKGROUND
══════════════════════════════════════ */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = Array.from({ length: 35 }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     2 + Math.random() * 4,
    speed: 0.35 + Math.random() * 0.75,
    alpha: 0.2  + Math.random() * 0.5,
    color: Math.random() > 0.5 ? '#ffffff' : '#ffb6c1'
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle    = p.color;
    ctx.globalAlpha  = p.alpha;
    ctx.fill();

    p.y -= p.speed;

    // Reset particle to bottom when it floats off the top
    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}

// Kick everything off
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});