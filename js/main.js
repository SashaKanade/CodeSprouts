(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  function getSelectedInterests(form) {
    return Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(
      (el) => el.value
    );
  }

  function showFormSuccess(form, message) {
    const successEl = form.parentElement.querySelector(".form-success");
    if (successEl) {
      const msgEl = successEl.querySelector("[data-success-message]");
      if (msgEl) msgEl.textContent = message;
      form.hidden = true;
      successEl.classList.add("visible");
    }
  }

  document.querySelectorAll("[data-signup-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const type = form.dataset.signupForm;
      const interests = getSelectedInterests(form);

      if (interests.length === 0) {
        const interestsGroup = form.querySelector(".interests-grid");
        if (interestsGroup) {
          interestsGroup.scrollIntoView({ behavior: "smooth", block: "center" });
          interestsGroup.style.outline = "2px solid var(--pink-500)";
          setTimeout(() => {
            interestsGroup.style.outline = "";
          }, 2000);
        }
        return;
      }

      const payload = {
        type,
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        interests,
        questions: form.questions.value.trim(),
        submittedAt: new Date().toISOString(),
      };

      const storageKey = `codesprouts_${type}_signups`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.push(payload);
      localStorage.setItem(storageKey, JSON.stringify(existing));

      const messages = {
        member: "Welcome to CodeSprouts! We'll be in touch soon with next steps for members.",
        tutoring: "Your tutoring request has been received. A coordinator will match you with a tutor shortly.",
        tutor: "Thank you for applying to tutor! Our team will review your application and reach out via email.",
      };

      showFormSuccess(form, messages[type] || "Thank you for signing up!");
      form.reset();
    });
  });
})();

(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  // Only apply on desktop where header is sticky
  if (window.innerWidth <= 900) return;

  var lastY = window.scrollY;

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > 80 && y > lastY) {
      // Scrolling down — hide
      header.style.transform = "translateY(-100%)";
      header.style.transition = "transform 0.3s ease";
    } else {
      // Scrolling up — show
      header.style.transform = "translateY(0)";
      header.style.transition = "transform 0.3s ease";
    }
    lastY = y;
  }, { passive: true });
})();
