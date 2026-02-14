const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const buttonsArea = document.getElementById("buttonsArea");
const heartsLayer = document.getElementById("heartsLayer");

const YES_GROW = {
  step: 0.5,
  max: 100,
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
  const noBtnRect = noBtn.getBoundingClientRect();
  const yesBtnRect = yesBtn.getBoundingClientRect();

  // IMPORTANT: Account for the scale of the growing button
  const scaledWidth = yesBtnRect.width;
  const scaledHeight = yesBtnRect.height;
  const yesCenter = {
    x: yesBtnRect.left + scaledWidth / 2,
    y: yesBtnRect.top + scaledHeight / 2
  };

  const padding = 8;
  const limitX = Math.max(padding, areaRect.width - noBtnRect.width - padding);
  const limitY = Math.max(padding, areaRect.height - noBtnRect.height - padding);

  let x, y, attempts = 0;
  let overlapping = true;

  while (overlapping && attempts < 50) {
    x = clamp(Math.random() * limitX, padding, limitX);
    y = clamp(Math.random() * limitY, padding, limitY);

    const proposedRect = {
      left: x + areaRect.left,
      right: x + areaRect.left + noBtnRect.width,
      top: y + areaRect.top,
      bottom: y + areaRect.top + noBtnRect.height
    };

    const buffer = 20; 
    overlapping = !(
      proposedRect.right < yesBtnRect.left - buffer ||
      proposedRect.left > yesBtnRect.right + buffer ||
      proposedRect.bottom < yesBtnRect.top - buffer ||
      proposedRect.top > yesBtnRect.bottom + buffer
    );
    attempts++;
  }

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.right = "auto";
}

function growYesAndMaybeHideNo() {
  yesScale += YES_GROW.step;
  yesBtn.style.transform = `translateX(-50%) scale(${yesScale})`;
  
  if (yesScale > 20) {
    yesBtn.style.width = "100vw";
    yesBtn.style.height = "100vh";
    yesBtn.style.borderRadius = "0";
    yesBtn.style.top = "0";
    yesBtn.style.left = "0";
    yesBtn.style.transform = "none";
    yesBtn.click(); // Auto-trigger success when it's huge
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

// Interaction: Force mobile-style behavior on all devices
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  growYesAndMaybeHideNo();
  moveNoButton();
});

// Remove mouseenter/hover behavior to strictly use click-to-move
noBtn.removeEventListener("mouseenter", moveNoButton);
noBtn.removeEventListener("pointerenter", moveNoButton);

yesBtn.addEventListener("click", () => {
  document.body.classList.add("accepted");
  document.body.classList.add("accepted-bg");
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
