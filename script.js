const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const buttonsArea = document.getElementById("buttonsArea");
const heartsLayer = document.getElementById("heartsLayer");

const YES_GROW = {
  step: 0.18,
  max: 2.2,
  hideNoAt: 1.8,
};

const FIREWORKS = {
  maxBursts: 30,
};

let yesScale = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function moveNoButton() {
  const areaRect = buttonsArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 8;
  const limitX = Math.max(padding, areaRect.width - btnRect.width - padding);
  const limitY = Math.max(padding, areaRect.height - btnRect.height - padding);

  const x = clamp(Math.random() * limitX, padding, limitX);
  const y = clamp(Math.random() * limitY, padding, limitY);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.right = "auto";
}

function growYesAndMaybeHideNo() {
  yesScale = Math.min(YES_GROW.max, yesScale + YES_GROW.step);
  yesBtn.style.transform = `scale(${yesScale})`;

  if (yesScale >= YES_GROW.hideNoAt) {
    noBtn.style.display = "none";
  }
}

function createBurst(x, y) {
  const burst = document.createElement("div");
  burst.className = "fx-burst";
  burst.style.left = x + "px";
  burst.style.top = y + "px";

  const sparks = randInt(10, 18);
  for (let i = 0; i < sparks; i++) {
    const spark = document.createElement("div");
    spark.className = "fx-spark";
    spark.style.setProperty("--h", String(randInt(0, 360)));

    const angle = (Math.PI * 2 * i) / sparks + Math.random() * 0.35;
    const dist = randInt(30, 110);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    spark.style.setProperty("--dx", dx.toFixed(2));
    spark.style.setProperty("--dy", dy.toFixed(2));

    burst.appendChild(spark);
  }

  document.body.appendChild(burst);

  const allBursts = document.querySelectorAll(".fx-burst");
  if (allBursts.length > FIREWORKS.maxBursts) {
    allBursts[0].remove();
  }
}

function launchFireworks() {
  const bursts = randInt(5, 8);
  for (let i = 0; i < bursts; i++) {
    const x = randInt(20, window.innerWidth - 20);
    const y = randInt(20, Math.floor(window.innerHeight * 0.65));
    setTimeout(() => createBurst(x, y), i * 110);
  }
}

let fireworksInterval = null;

function startContinuousFireworks() {
  if (fireworksInterval) return;
  launchFireworks();
  fireworksInterval = setInterval(() => {
    const x = randInt(20, window.innerWidth - 20);
    const y = randInt(20, Math.floor(window.innerHeight * 0.65));
    createBurst(x, y);
  }, 800);
}

// Desktop hover
noBtn.addEventListener("mouseenter", moveNoButton);

// Cross-device: pointer events (covers mouse + touch + pen)
noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  if (isCoarsePointer()) growYesAndMaybeHideNo();
  moveNoButton();
});

// Fallback for older mobile browsers
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  document.body.classList.add("accepted");
  document.body.classList.add("accepted-bg");
  response.textContent = "YAYYY!! 💕";
  buttonsArea.style.display = "none";
  startContinuousFireworks();
});

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖";

  const x = (Math.random() * 120 - 60).toFixed(2) + "vw";
  const s = (Math.random() * 0.9 + 0.6).toFixed(2);
  heart.style.setProperty("--x", x);
  heart.style.setProperty("--s", s);

  heartsLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

setInterval(createHeart, 500);
