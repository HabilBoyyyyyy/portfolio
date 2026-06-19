// ===== LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2200);
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");
let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX - 3 + "px";
  cursorDot.style.top = mouseY - 3 + "px";
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.left = cursorX - 10 + "px";
  cursor.style.top = cursorY - 10 + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document
  .querySelectorAll(
    "a, button, .project-card, .skill-card, .tech-item, .cert-card, .achievement-card, .blog-card, .contact-item",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
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
    ctx.fillStyle = `rgba(0, 245, 212, ${this.opacity})`;
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
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

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
const words = [
  "digital experiences.",
  "modern websites.",
  "interactive apps.",
  "clean interfaces.",
  "scalable solutions.",
];
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
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = "linear-gradient(135deg, #00d4ff, #00bbf9)";
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = "";
    e.target.reset();
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

// ===== TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    card.style.transition = "transform 0.5s ease";
  });
  card.addEventListener("mouseenter", () => {
    card.style.transition = "none";
  });
});

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
