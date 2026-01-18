// Clean transitions: crossfade + subtle blur (Barba.js + GSAP)
// Run via a local server (http://), not file://

const overlaySel = ".transition-overlay";

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".links a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === path);
  });
}

function pageEnterAnimation(container) {
  const targets = container.querySelectorAll(".panel, .tile, .item, .section-title, .footer");
  gsap.fromTo(
    targets,
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: "power2.out" }
  );
}

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

barba.init({
  preventRunning: true,
  transitions: [{
    name: "seamless",
    async leave(data) {
      const done = this.async();
      const overlay = document.querySelector(overlaySel);

      lockScroll(true);

      gsap.to(overlay, { opacity: 1, duration: 0.15, ease: "power1.out" });

      gsap.to(data.current.container, {
        opacity: 0,
        y: -6,
        filter: "blur(8px)",
        duration: 0.28,
        ease: "power2.in",
        onComplete: done
      });
    },

    enter(data) {
      const overlay = document.querySelector(overlaySel);

      gsap.set(data.next.container, {
        opacity: 0,
        y: 6,
        filter: "blur(8px)"
      });

      window.scrollTo(0, 0);

      gsap.to(data.next.container, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.38,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(overlay, { opacity: 0, duration: 0.18, ease: "power1.inOut" });
          lockScroll(false);
        }
      });

      setActiveNav();
      pageEnterAnimation(data.next.container);
    },

    once(data) {
      setActiveNav();
      const overlay = document.querySelector(overlaySel);
      gsap.set(overlay, { opacity: 0 });
      pageEnterAnimation(data.next.container);
    }
  }]
});

window.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
});
