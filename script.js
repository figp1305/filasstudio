// ============================================================
// FILAS STUDIO — Landing Page JS
// ============================================================

const WHATSAPP_NUMBER = "573192757931";

const WA_MESSAGES = {
  general: "Hola FILAS STUDIO, quiero anunciar mi negocio. Me gustaría conocer los planes.",
  basico: "Hola FILAS STUDIO, me interesa el plan Filas Básico. Quiero anunciar mi negocio.",
  plus: "Hola FILAS STUDIO, me interesa el plan Filas Plus. Quiero una mini landing personalizada.",
};

function buildWaLink(type = "general") {
  const msg = WA_MESSAGES[type] || WA_MESSAGES.general;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function trackEvent(eventName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, timestamp: Date.now() });
  console.log(`[FILAS] evento: ${eventName}`);
}

// 1. WhatsApp Links
document.querySelectorAll("[data-wa]").forEach((el) => {
  const type = el.getAttribute("data-wa") || "general";
  el.setAttribute("href", buildWaLink(type));
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
  el.addEventListener("click", () => trackEvent(`click_whatsapp_${type}`));
});

// 2. Menú Móvil
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

// 3. Toggle de precios
const toggleWeek = document.getElementById("toggleWeek");
const toggleMonth = document.getElementById("toggleMonth");

if (toggleWeek && toggleMonth) {
  const updatePrices = (period) => {
    document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("active"));
    if (period === "week") toggleWeek.classList.add("active");
    else toggleMonth.classList.add("active");

    document.querySelectorAll(".plan-price-display").forEach(display => {
      const priceEl = display.querySelector(".plan-price");
      const periodEl = display.querySelector(".plan-period");
      const saveEl = display.querySelector(".plan-save");

      if (period === "week") {
        priceEl.textContent = priceEl.dataset.priceWeek;
        periodEl.textContent = periodEl.dataset.periodWeek;
        saveEl.textContent = "";
        saveEl.style.display = "none";
      } else {
        priceEl.textContent = priceEl.dataset.priceMonth;
        periodEl.textContent = periodEl.dataset.periodMonth;
        saveEl.textContent = saveEl.dataset.saveMonth;
        saveEl.style.display = "inline-block";
      }
    });

    document.querySelectorAll(".feature-month-only").forEach(feat => {
      feat.style.display = period === "month" ? "list-item" : "none";
    });
  };

  toggleWeek.addEventListener("click", () => updatePrices("week"));
  toggleMonth.addEventListener("click", () => updatePrices("month"));
}

// 4. Función genérica para carruseles
function setupSlider(sliderId, prevBtnId, nextBtnId) {
  const slider = document.getElementById(sliderId);
  const btnPrev = document.getElementById(prevBtnId);
  const btnNext = document.getElementById(nextBtnId);

  if (!slider || !btnPrev || !btnNext) return;

  const getScrollAmount = () => {
    const card = slider.querySelector(".card");
    if (card) {
      const style = window.getComputedStyle(slider);
      const gap = parseInt(style.gap) || 24;
      return card.offsetWidth + gap;
    }
    return 320;
  };

  btnNext.addEventListener("click", () => {
    slider.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  btnPrev.addEventListener("click", () => {
    slider.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  const updateButtons = () => {
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    btnPrev.style.opacity = slider.scrollLeft <= 5 ? "0.3" : "1";
    btnPrev.style.pointerEvents = slider.scrollLeft <= 5 ? "none" : "auto";
    btnNext.style.opacity = slider.scrollLeft >= maxScrollLeft - 5 ? "0.3" : "1";
    btnNext.style.pointerEvents = slider.scrollLeft >= maxScrollLeft - 5 ? "none" : "auto";
  };

  updateButtons();
  slider.addEventListener("scroll", updateButtons);
}

// Inicializar ambos carruseles
setupSlider("sliderEjemplos", "btnPrev", "btnNext");
setupSlider("sliderServicios", "btnPrevServ", "btnNextServ");

// 5. Drag con mouse
document.querySelectorAll(".slider-track").forEach((slider) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.style.cursor = "grabbing";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => { isDown = false; slider.style.cursor = "grab"; });
  slider.addEventListener("mouseup", () => { isDown = false; slider.style.cursor = "grab"; });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
  slider.style.cursor = "grab";
});

// 6. Eventos FAQ y CTA
document.querySelectorAll('[data-event="click_ver_planes"]').forEach((el) => {
  el.addEventListener("click", () => trackEvent("click_ver_planes"));
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) trackEvent("faq_open");
  });
});

// 7. Modal Términos
const termsModal = document.getElementById("termsModal");

function openTerms() {
  if (termsModal) {
    termsModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeTerms() {
  if (termsModal) {
    termsModal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

window.openTerms = openTerms;
window.closeTerms = closeTerms;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && termsModal && termsModal.classList.contains("active")) {
    closeTerms();
  }
});