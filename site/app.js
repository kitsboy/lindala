(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ── Year ── */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Header scroll state ── */
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile nav ── */
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ── Hero crossfade ── */
  const heroImgs = $$(".hero-img");
  if (heroImgs.length > 1) {
    let idx = 0;
    setInterval(() => {
      heroImgs[idx].classList.remove("is-active");
      idx = (idx + 1) % heroImgs.length;
      heroImgs[idx].classList.add("is-active");
    }, 5500);
  }

  /* ── Project galleries ── */
  $$(".credit-card").forEach((card) => {
    card.addEventListener("click", () => {
      const project = card.dataset.project;
      if (!project) return;
      const gallery = $(`#gallery-${project}`);
      if (!gallery) return;
      // close others
      $$(".project-gallery").forEach((g) => {
        if (g !== gallery) g.hidden = true;
      });
      gallery.hidden = !gallery.hidden;
      if (!gallery.hidden) {
        gallery.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  $$(".close-gallery").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.close;
      const gallery = $(`#gallery-${id}`);
      if (gallery) gallery.hidden = true;
    });
  });

  /* ── Lightbox ── */
  const lightbox = $("#lightbox");
  const lightboxImg = $(".lightbox-img");
  let lightboxSet = [];
  let lightboxIndex = 0;

  const openLightbox = (src, set = []) => {
    if (!lightbox || !lightboxImg) return;
    lightboxSet = set.length ? set : [src];
    lightboxIndex = Math.max(0, lightboxSet.indexOf(src));
    lightboxImg.src = lightboxSet[lightboxIndex];
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  const stepLightbox = (dir) => {
    if (!lightboxSet.length) return;
    lightboxIndex = (lightboxIndex + dir + lightboxSet.length) % lightboxSet.length;
    lightboxImg.src = lightboxSet[lightboxIndex];
  };

  const collectSet = (img) => {
    const root = img.closest(".masonry, .stills-track, .project-gallery");
    if (!root) return [img.dataset.full || img.src];
    return $$("img[data-full]", root).map((i) => i.dataset.full);
  };

  $$("img[data-full]").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(img.dataset.full, collectSet(img));
    });
  });

  if (lightbox) {
    $(".lightbox-close")?.addEventListener("click", closeLightbox);
    $(".lightbox-nav.prev")?.addEventListener("click", () => stepLightbox(-1));
    $(".lightbox-nav.next")?.addEventListener("click", () => stepLightbox(1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  /* ── Horizontal drag on stills ── */
  const track = $("#stills-track");
  if (track) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    window.addEventListener("mouseup", () => {
      isDown = false;
    });
    track.addEventListener("mouseleave", () => {
      isDown = false;
    });
    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });
  }

  /* ── Scroll reveal ── */
  const revealTargets = [
    ...$$(".section-head"),
    ...$$(".credit--feature"),
    ...$$(".credit-card"),
    ...$$(".reel"),
    ...$$(".about-grid > *"),
  ];
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
