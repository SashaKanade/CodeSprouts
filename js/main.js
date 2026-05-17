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

  // Formspree submission handler
  document.querySelectorAll("[data-signup-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const type = form.dataset.signupForm;
      const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(el => el.value);

      if (interests.length === 0) {
        const interestsGroup = form.querySelector(".interests-grid");
        if (interestsGroup) {
          interestsGroup.scrollIntoView({ behavior: "smooth", block: "center" });
          interestsGroup.style.outline = "2px solid rgba(255,255,255,0.8)";
          setTimeout(() => { interestsGroup.style.outline = ""; }, 2000);
        }
        return;
      }

      const submitBtn = form.querySelector("[type=submit]");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      const data = {
        formType: type,
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        interests: interests.join(", "),
        questions: form.questions.value.trim(),
      };

      try {
        const res = await fetch("https://formspree.io/f/xjgzbobr", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const successEl = form.parentElement.querySelector(".form-success");
          if (successEl) {
            const msgEl = successEl.querySelector("[data-success-message]");
            const messages = {
              member: "Welcome to CodeSprouts! We'll be in touch soon with next steps.",
              tutoring: "Your tutoring request has been received. We'll match you with a tutor shortly.",
              tutor: "Thank you for applying to tutor! Our team will review your application and reach out via email.",
            };
            if (msgEl) msgEl.textContent = messages[type] || "Thank you for signing up!";
            form.hidden = true;
            successEl.classList.add("visible");
          }
        } else {
          alert("Something went wrong. Please try again.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.label || "Submit";
          }
        }
      } catch (err) {
        alert("Network error. Please check your connection and try again.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || "Submit";
        }
      }
    });
  });

  // Hide header on scroll down, show on scroll up (desktop only)
  var header = document.querySelector(".site-header");
  if (header && window.innerWidth > 900) {
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      header.style.transition = "transform 0.3s ease";
      header.style.transform = (y > 80 && y > lastY) ? "translateY(-100%)" : "translateY(0)";
      lastY = y;
    }, { passive: true });
  }
})();
