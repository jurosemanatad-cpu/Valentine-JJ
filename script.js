const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const buttonsArea = document.getElementById("buttonsArea");
const heartsLayer = document.getElementById("heartsLayer");

const YES_GROW = {
  step: 0.2,
  max: 100,
  hideNoAt: 1.8,
};

const NO_SHRINK = {
  step: 0.1,
  min: 0.2,
};

const CAT_IMAGES = [
  "images/cat1.jpg",
  "images/cat2.png",
  "images/cat3.png",
  "images/cat4.png",
  "images/cat5.jpg",
  "images/cat6.jpg",
  "images/cat7.gif"
];

const FIREWORKS = {
  maxBursts: 30,
};

let yesScale = 1;
let noScale = 1;

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

  // Switch to absolute for random movement
  noBtn.style.position = "absolute";

  const padding = 10;
  // Calculate limits within the buttonsArea
  const limitX = areaRect.width - noBtnRect.width - padding;
  const limitY = areaRect.height - noBtnRect.height - padding;

  let x, y, attempts = 0;
  let overlapping = true;

  while (overlapping && attempts < 100) {
    x = clamp(Math.random() * limitX, padding, limitX);
    y = clamp(Math.random() * limitY, padding, limitY);

    const buffer = 15;
    const proposedLeft = x + areaRect.left;
    const proposedTop = y + areaRect.top;

    overlapping = !(
      proposedLeft + noBtnRect.width < yesBtnRect.left - buffer ||
      proposedLeft > yesBtnRect.right + buffer ||
      proposedTop + noBtnRect.height < yesBtnRect.top - buffer ||
      proposedTop > yesBtnRect.bottom + buffer
    );
    attempts++;
  }

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.right = "auto";
  noBtn.style.margin = "0"; // Remove flex margins if any
}

function growYesAndShrinkNo() {
  yesScale += YES_GROW.step;
  noScale = Math.max(NO_SHRINK.min, noScale - NO_SHRINK.step);

  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;
  
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

function spawnCat(x, y) {
  const cat = document.createElement("img");
  const randomImg = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
  cat.src = randomImg;
  cat.className = "cat-stamp";
  
  // Center the 40px image on the click point
  cat.style.left = (x - 20) + "px";
  cat.style.top = (y - 20) + "px";
  
  buttonsArea.appendChild(cat);
}

// Interaction: Force mobile-style behavior on all devices
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  // Get current position before moving
  const rect = noBtn.getBoundingClientRect();
  const areaRect = buttonsArea.getBoundingClientRect();
  const clickX = rect.left - areaRect.left + rect.width / 2;
  const clickY = rect.top - areaRect.top + rect.height / 2;
  
  spawnCat(clickX, clickY);
  growYesAndShrinkNo();
  moveNoButton();
});

// Remove mouseenter/hover behavior to strictly use click-to-move
noBtn.removeEventListener("mouseenter", moveNoButton);
noBtn.removeEventListener("pointerenter", moveNoButton);

yesBtn.addEventListener("click", () => {
  document.body.classList.add("accepted");
  document.body.classList.add("accepted-bg");
  buttonsArea.style.display = "none";
  
  // Remove all cat stamps
  const cats = document.querySelectorAll(".cat-stamp");
  cats.forEach(c => c.remove());
  
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
