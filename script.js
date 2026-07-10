const scene   = document.getElementById("scene");
const body    = document.body;
const replay  = document.getElementById("replay");
const canvas  = document.getElementById("confetti");
const ctx     = canvas.getContext("2d");

let W, H, pieces = [], raf = null;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const COLORS = ["#f2a1b3", "#f5c25a", "#a9c8f0", "#d1607a", "#e7b84f", "#fffaf4"];

function spawnConfetti(count = 160) {
  pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: W / 2 + (Math.random() - 0.5) * 120,
      y: H * 0.45,
      vx: (Math.random() - 0.5) * 22,
      vy: Math.random() * -24 - 8,
      g: 0.6 + Math.random() * 0.3,
      size: 5 + Math.random() * 7,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      life: 0,
    });
  }
  if (!raf) tick();
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  let alive = false;
  for (const p of pieces) {
    p.vy += p.g;
    p.x  += p.vx;
    p.y  += p.vy;
    p.vx *= 0.99;
    p.rot += p.vr;
    p.life++;
    if (p.y < H + 40) alive = true;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, 1 - p.life / 220);
    if (p.shape === "rect") {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  if (alive) {
    raf = requestAnimationFrame(tick);
  } else {
    ctx.clearRect(0, 0, W, H);
    raf = null;
  }
}

function open() {
  if (body.classList.contains("opened")) return;
  body.classList.add("opened");
  setTimeout(() => spawnConfetti(), 220);
}

function reset() {
  body.classList.remove("opened");
  pieces = [];
  ctx.clearRect(0, 0, W, H);
}

scene.addEventListener("click", open);
scene.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
});
scene.tabIndex = 0;
scene.setAttribute("role", "button");
scene.setAttribute("aria-label", "Avaa syntymäpäiväkortti");

replay.addEventListener("click", reset);
