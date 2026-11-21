
"use strict";

// VNR FUNCTION HALL
// Custom Website Demo
// Developed by GOKAP Technologies

document.addEventListener("DOMContentLoaded", () => {

  // 1. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      });
    });
  }

  // 2. HEADER SCROLL EFFECT
  const header = document.querySelector(".header");

  function updateHeader() {
    if (!header) return;

    header.style.background =
      window.scrollY > 50
        ? "rgba(8, 8, 8, 0.98)"
        : "rgba(10, 10, 10, 0.92)";
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  // 3. ACTIVE NAVIGATION LINKS
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active-link", active);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 4. GALLERY FULLSCREEN PREVIEW
  const galleryImages = document.querySelectorAll(".gallery-grid img");

  const lightbox = document.createElement("div");
  lightbox.id = "galleryLightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photo preview");
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <button class="lightbox-close"
      type="button"
      aria-label="Close photo preview">✕</button>

    <button class="lightbox-prev"
      type="button"
      aria-label="Previous photo">❮</button>

    <img class="lightbox-image" alt="Venue photo preview">

    <button class="lightbox-next"
      type="button"
      aria-label="Next photo">❯</button>

    <p class="lightbox-caption"></p>
  `;

  document.body.appendChild(lightbox);

  // Add gallery styles
  const galleryStyles = document.createElement("style");

  galleryStyles.textContent = `
    .nav a.active-link:not(.nav-btn) {
      color: #d8b46a;
    }

    #galleryLightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.96);
      padding: 65px 55px;
    }

    #galleryLightbox.open {
      display: flex;
    }

    .lightbox-image {
      width: auto;
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border: 1px solid rgba(216, 180, 106, 0.4);
    }

    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      border: 0;
      background: transparent;
      color: #d8b46a;
      cursor: pointer;
      font-size: 2rem;
      z-index: 2;
    }

    .lightbox-close {
      top: 15px;
      right: 25px;
    }

    .lightbox-prev {
      left: 15px;
    }

    .lightbox-next {
      right: 15px;
    }

    .lightbox-caption {
      position: absolute;
      bottom: 18px;
      left: 20px;
      right: 20px;
      text-align: center;
      color: #f8f5ee;
      font-size: 0.9rem;
    }

    .gallery-grid img {
      cursor: pointer;
    }

    @media (max-width: 600px) {
      #galleryLightbox {
        padding: 65px 38px;
      }

      .lightbox-prev {
        left: 5px;
      }

      .lightbox-next {
        right: 5px;
      }
    }
  `;

  document.head.appendChild(galleryStyles);

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  let currentImageIndex = 0;
  let lastFocusedElement = null;

  function showImage(index) {
    if (!galleryImages.length) return;

    currentImageIndex =
      (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[currentImageIndex];

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Venue gallery photo";
    lightboxCaption.textContent = image.alt || "";
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;

    showImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryImages.forEach((image, index) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute(
      "aria-label",
      `View ${image.alt || "gallery photo"}`
    );

    image.addEventListener("click", () => {
      openLightbox(index);
    });

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    showImage(currentImageIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showImage(currentImageIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentImageIndex + 1);
    }

    if (event.key === "Tab") {
      const controls = [
        closeButton,
        prevButton,
        nextButton
      ];

      const currentIndex = controls.indexOf(document.activeElement);

      if (event.shiftKey && currentIndex <= 0) {
        event.preventDefault();
        nextButton.focus();
      } else if (!event.shiftKey && currentIndex === 2) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });

  // 5. ENQUIRY FORM - DEMO ONLY
  const enquiryForm = document.getElementById("enquiryForm");
  const formStatus = document.getElementById("formStatus");

  if (enquiryForm && formStatus) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!enquiryForm.reportValidity()) return;

      formStatus.textContent =
        "Demo preview only. Your enquiry has not been sent. Please contact the venue directly.";

      // No form data is stored or transmitted.
      // Connect a backend only after venue approval.
    });
  }

  // 6. EVENT DATE VALIDATION
  const eventDate = document.getElementById("eventDate");

  if (eventDate) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    eventDate.min = localDate;
  }

  // 7. SIMPLE SCROLL REVEAL
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealElements = document.querySelectorAll(
      ".facility-card, .event-card, .about-content, .contact-info"
    );

    const revealStyle = document.createElement("style");

    revealStyle.textContent = `
      .reveal-ready {
        opacity: 0;
        transform: translateY(25px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }

      .reveal-ready.reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    document.head.appendChild(revealStyle);

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal-ready");
      revealObserver.observe(element);
    });
  }

  console.log("VNR Function Hall demo loaded successfully.");
});
