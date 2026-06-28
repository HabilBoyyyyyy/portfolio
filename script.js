// ===== LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2200);
});

// ===== PARTICLES =====
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(26, 18, 8, ${this.opacity * 0.3})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(26, 18, 8, ${0.04 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== ABOUT PHOTO — 3D TILT / GLOW / SHEEN =====
function initTiltCard(rootEl, surfaceEl) {
  if (!rootEl || !surfaceEl) return;

  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;
  const INITIAL_DURATION = 1200;

  let rafId = null;
  let running = false;
  let lastTs = 0;
  let currentX = 0,
    currentY = 0;
  let targetX = 0,
    targetY = 0;
  let initialUntil = 0;
  let leaveRafId = null;

  const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
  const round = (v, p = 3) => parseFloat(v.toFixed(p));
  const adjust = (v, fMin, fMax, tMin, tMax) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

  function setVarsFromXY(x, y) {
    const width = surfaceEl.clientWidth || 1;
    const height = surfaceEl.clientHeight || 1;

    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const vars = {
      "--pointer-x": `${percentX}%`,
      "--pointer-y": `${percentY}%`,
      "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
      "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
      "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      "--pointer-from-top": `${percentY / 100}`,
      "--pointer-from-left": `${percentX / 100}`,
      "--rotate-x": `${round(-(centerX / 9))}deg`,
      "--rotate-y": `${round(centerY / 7)}deg`,
    };
    for (const [k, v] of Object.entries(vars)) rootEl.style.setProperty(k, v);
  }

  function step(ts) {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;
    setVarsFromXY(currentX, currentY);

    const stillFar =
      Math.abs(targetX - currentX) > 0.05 ||
      Math.abs(targetY - currentY) > 0.05;
    if (stillFar) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
    }
  }

  function start() {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  }

  function setTarget(x, y) {
    targetX = x;
    targetY = y;
    start();
  }

  function toCenter() {
    setTarget(surfaceEl.clientWidth / 2, surfaceEl.clientHeight / 2);
  }

  function getOffsets(evt) {
    const rect = surfaceEl.getBoundingClientRect();
    return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
  }

  surfaceEl.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "touch") return; // skip continuous tilt on touch
    rootEl.classList.add("active");
    rootEl.classList.add("entering");
    setTimeout(() => rootEl.classList.remove("entering"), 180);
    const {x, y} = getOffsets(e);
    currentX = x;
    currentY = y;
    setVarsFromXY(x, y);
    setTarget(x, y);
  });

  surfaceEl.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const {x, y} = getOffsets(e);
    setTarget(x, y);
  });

  surfaceEl.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "touch") return;
    toCenter();
    if (leaveRafId) cancelAnimationFrame(leaveRafId);
    const checkSettle = () => {
      const settled = Math.hypot(targetX - currentX, targetY - currentY) < 0.6;
      if (settled) {
        rootEl.classList.remove("active");
        leaveRafId = null;
      } else {
        leaveRafId = requestAnimationFrame(checkSettle);
      }
    };
    leaveRafId = requestAnimationFrame(checkSettle);
  });

  // Gentle entrance animation on page load
  const initialX = (surfaceEl.clientWidth || 0) - 70;
  const initialY = 60;
  currentX = initialX;
  currentY = initialY;
  setVarsFromXY(currentX, currentY);
  toCenter();
  initialUntil = performance.now() + INITIAL_DURATION;
  start();
}

initTiltCard(
  document.getElementById("pinnedPhoto"),
  document.getElementById("pinnedPhotoShell"),
);

// ===== NAVIGATION =====
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "";
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// ===== TYPING EFFECT =====
const typedEl = document.getElementById("typed");
const words = ["digital experiences.", "modern websites.", "clean interfaces."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typedEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  const speed = isDeleting ? 50 : 100;
  setTimeout(type, speed);
}
setTimeout(type, 2500);

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {threshold: 0.1, rootMargin: "0px 0px -50px 0px"},
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillBars = document.querySelectorAll(".skill-bar-fill");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  },
  {threshold: 0.5},
);

skillBars.forEach((bar) => skillObserver.observe(bar));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll(".stat-number");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-count"));
        let count = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        const updateCounter = () => {
          count += step;
          if (count < target) {
            entry.target.textContent = Math.floor(count) + "+";
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target + "+";
          }
        };
        updateCounter();
        counterObserver.unobserve(entry.target);
      }
    });
  },
  {threshold: 0.5},
);

statNumbers.forEach((num) => counterObserver.observe(num));

// ===== BACK TO TOP =====
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({top: 0, behavior: "smooth"});
});

// ===== FORM SUBMISSION =====
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button");
  const originalText = btn.innerHTML;

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {Accept: "application/json"},
    });

    if (response.ok) {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = "linear-gradient(135deg, #2d5a27, #3d7a34)";
      form.reset();
    } else {
      btn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
      btn.style.background = "linear-gradient(135deg, #8b1a1a, #5a1010)";
    }
  } catch (error) {
    btn.innerHTML = '<i class="fas fa-times"></i> Network Error';
    btn.style.background = "linear-gradient(135deg, #8b1a1a, #5a1010)";
  }

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = "";
    btn.disabled = false;
  }, 3000);
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top: targetPosition, behavior: "smooth"});
    }
  });
});

// ===== PARALLAX EFFECT ON HERO GRADIENTS =====
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.querySelectorAll(".hero-bg-gradient").forEach((g, i) => {
    g.style.transform = `translate(${Math.sin(scrollY * 0.002 + i) * 30}px, ${scrollY * 0.15}px)`;
  });
});

// ===== FEATURED PROJECTS — CASE FILES =====
// Add more screenshots to any project's `images` array to get a multi-slide
// carousel automatically — one image just shows a static photo, no carousel UI.
const projectsData = [
  {
    caseNo: "001",
    icon: "fa-robot",
    title: "Trash-Collecting Robot",
    description:
      "A robotic arm built with an Arduino Uno, combining a custom acrylic robotic hand with a mobile chassis to autonomously locate, grab, and dispose of small trash items.",
    tags: ["Arduino", "C++"],
    links: [{icon: "fab fa-github", label: "Source", url: "#"}],
    images: ["assets/Images/trash-robot.jpeg"],
  },
  {
    caseNo: "002",
    icon: "fa-skull",
    title: "The Gallows",
    description:
      "A film-noir detective-themed hangman game built with vanilla JS, featuring a custom Web Audio sound engine, difficulty/category selection, and a live scoring system — no frameworks, no libraries.",
    tags: ["JavaScript"],
    links: [
      {
        icon: "fab fa-github",
        label: "Source",
        url: "https://github.com/HabilBoyyyyyy/Hangman_game",
      },
    ],
    images: ["assets/Images/Hangman_SS.png", "assets/Images/Hangman_SS(1).png"],
  },
  {
    caseNo: "003",
    icon: "fa-brain",
    title: "News Summarization & NER",
    description:
      "Fine-tuned transformer models (DistilBART, DistilBERT, T5, RoBERTa) for news summarization and Named Entity Recognition, reaching 97.7% accuracy on entity recognition.",
    tags: ["Python", "NLP"],
    links: [
      {icon: "fab fa-github", label: "Source", url: "#"},
      {icon: "fas fa-external-link-alt", label: "Demo", url: "#"},
    ],
    images: [],
  },
  {
    caseNo: "004",
    icon: "fa-building",
    title: "Presdorm",
    description:
      "A dormitory management system prototype for President University, built with PHP, JavaScript, and MySQL. Led frontend development, attracting interest from the Dormitory Director.",
    tags: ["PHP", "MySQL"],
    links: [
      {
        icon: "fab fa-github",
        label: "Source",
        url: "https://github.com/Thoriqzulatsari/presdorm-update",
      },
    ],
    images: [],
  },
  {
    caseNo: "005",
    icon: "fa-palette",
    title: "TechSprint Case Study",
    description:
      "Developed the UI/UX Design track case study and judging rubric for TechSprint, a multi-track competition under PUMA IS with 8 competing teams.",
    tags: ["UI/UX", "Case Study"],
    links: [
      {
        icon: "fas fa-external-link-alt",
        label: "Document",
        url: "https://docs.google.com/document/d/1h4S9jVMmSjjNXds7NpR170MXFPavk2YLTFNVXsalHcU/edit?usp=sharing",
      },
    ],
    images: [],
  },
];

const CAROUSEL_INTERVAL = 4000;
const caseGridEl = document.getElementById("caseGrid");

function buildCardMedia(proj) {
  const images = proj.images && proj.images.length ? proj.images : null;
  const slideCount = images ? images.length : 1;

  const slidesHtml = images
    ? images
        .map(
          (src, i) => `
          <div class="case-card-slide${i === 0 ? " active" : ""}">
            <img src="${src}" alt="${proj.title} screenshot ${i + 1}" loading="lazy" />
          </div>`,
        )
        .join("")
    : `
      <div class="case-card-slide active">
        <div class="case-card-placeholder">
          <i class="fas ${proj.icon}"></i>
          <span>No preview available</span>
        </div>
      </div>`;

  const controlsHtml =
    slideCount > 1
      ? `
      <button class="case-card-arrow prev" aria-label="Previous image">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="case-card-arrow next" aria-label="Next image">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="case-card-dots">
        ${Array.from({length: slideCount})
          .map(
            (_, i) =>
              `<span class="case-card-dot${i === 0 ? " active" : ""}" data-index="${i}"></span>`,
          )
          .join("")}
      </div>`
      : "";

  return `
    <div class="case-card-media" data-slide-count="${slideCount}">
      <div class="case-card-track">${slidesHtml}</div>
      ${controlsHtml}
      <span class="case-card-no">No. ${proj.caseNo}</span>
    </div>`;
}

function buildCardBody(proj) {
  const tagsHtml = proj.tags
    .map((tag) => `<span class="project-tag">${tag}</span>`)
    .join("");
  const linksHtml = proj.links
    .map(
      (link) => `
      <a href="${link.url}" target="_blank" class="case-card-link">
        <i class="${link.icon}"></i> ${link.label}
      </a>`,
    )
    .join("");

  return `
    <div class="case-card-body">
      <div class="case-card-tags">${tagsHtml}</div>
      <h3 class="case-card-title">${proj.title}</h3>
      <p class="case-card-desc">${proj.description}</p>
      <div class="case-card-links">${linksHtml}</div>
    </div>`;
}

const TILT_ANGLES = [-2.2, 1.6, -1.4, 2, -1.8, 1.2]; // degrees, cycles per card

function renderCaseGrid() {
  if (!caseGridEl) return;

  caseGridEl.innerHTML = projectsData
    .map((proj, i) => {
      const tilt = TILT_ANGLES[i % TILT_ANGLES.length];
      return `
      <article class="case-card" style="--tilt: ${tilt}deg">
        <div class="case-card-pin"></div>
        ${buildCardMedia(proj)}
        ${buildCardBody(proj)}
        <div class="case-card-wall-shadow"></div>
      </article>`;
    })
    .join("");

  caseGridEl.querySelectorAll(".case-card").forEach((card, i) => {
    initCardCarousel(card, projectsData[i]);
  });
}

function initCardCarousel(card, proj) {
  const media = card.querySelector(".case-card-media");
  const slideCount = parseInt(media.getAttribute("data-slide-count"), 10);
  if (slideCount <= 1) return; // static image or placeholder, nothing to animate

  const track = media.querySelector(".case-card-track");
  const dots = media.querySelectorAll(".case-card-dot");
  const prevBtn = media.querySelector(".case-card-arrow.prev");
  const nextBtn = media.querySelector(".case-card-arrow.next");

  let activeIndex = 0;
  let timer = null;

  function goToSlide(index) {
    const slides = track.querySelectorAll(".case-card-slide");
    if (!slides.length) return;

    const prevIndex = activeIndex;
    activeIndex = (index + slides.length) % slides.length;
    if (prevIndex === activeIndex) return;

    const outgoing = slides[prevIndex];
    const incoming = slides[activeIndex];
    const goingForward =
      index > prevIndex ||
      (prevIndex === slides.length - 1 && activeIndex === 0);

    incoming.style.transform = goingForward
      ? "translateX(100%)"
      : "translateX(-100%)";
    incoming.style.opacity = "0";
    incoming.style.transition = "none";
    incoming.classList.add("active");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.style.transition =
          "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
        incoming.style.transform = "translateX(0%)";
        incoming.style.opacity = "1";

        outgoing.style.transition =
          "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
        outgoing.style.transform = goingForward
          ? "translateX(-100%)"
          : "translateX(100%)";
        outgoing.style.opacity = "0";
      });
    });

    setTimeout(() => {
      outgoing.classList.remove("active");
      outgoing.style.transform = "";
      outgoing.style.opacity = "";
      outgoing.style.transition = "";
    }, 520);

    dots.forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goToSlide(activeIndex + 1), CAROUSEL_INTERVAL);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopAutoplay();
      goToSlide(parseInt(dot.getAttribute("data-index"), 10));
      startAutoplay();
    });
  });

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      stopAutoplay();
      goToSlide(activeIndex - 1);
      startAutoplay();
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      stopAutoplay();
      goToSlide(activeIndex + 1);
      startAutoplay();
    });

  media.addEventListener("mouseenter", stopAutoplay);
  media.addEventListener("mouseleave", startAutoplay);

  // Pause autoplay while the card is scrolled off-screen (saves battery/CPU)
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAutoplay();
        else stopAutoplay();
      });
    },
    {threshold: 0.2},
  );
  visibilityObserver.observe(media);
}

renderCaseGrid();

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.style.color = "";
    if (link.getAttribute("href") === "#" + current) {
      link.style.color = "var(--accent-cyan)";
    }
  });
});
