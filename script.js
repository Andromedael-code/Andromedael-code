const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const tiltCards = document.querySelectorAll(".tilt-card");
const magneticLinks = document.querySelectorAll(".magnetic");

for (const item of revealItems) {
  const delay = item.getAttribute("data-reveal-delay");
  if (delay) {
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

for (const item of revealItems) {
  revealObserver.observe(item);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      const target = entry.target;
      const total = Number(target.getAttribute("data-count") || 0);
      const duration = 900;
      const startedAt = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = Math.round(total * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(target);
    }
  },
  { threshold: 0.6 }
);

for (const counter of counters) {
  counterObserver.observe(counter);
}

window.addEventListener(
  "pointermove",
  (event) => {
    root.style.setProperty("--cursor-x", `${event.clientX}px`);
    root.style.setProperty("--cursor-y", `${event.clientY}px`);
  },
  { passive: true }
);

for (const card of tiltCards) {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 7;

    card.style.setProperty("--card-x", `${x}px`);
    card.style.setProperty("--card-y", `${y}px`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
}

for (const link of magneticLinks) {
  link.addEventListener("pointermove", (event) => {
    const rect = link.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    link.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px) translateY(-2px)`;
  });

  link.addEventListener("pointerleave", () => {
    link.style.transform = "";
  });
}
