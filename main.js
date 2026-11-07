const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjyydpry";
const COOKIE_CONSENT_KEY = "veltzdental-cookie-consent";

function initNav() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

function showStatus(statusEl, type, message) {
  statusEl.textContent = message;
  statusEl.classList.remove("is-success", "is-error");
  statusEl.classList.add(`is-${type}`);
}

function initForm() {
  const form = document.getElementById("appointment-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const digits = phone.replace(/\D/g, "");

    if (!name) {
      showStatus(status, "error", "Укажите, как к вам обращаться.");
      return;
    }

    if (digits.length < 10) {
      showStatus(
        status,
        "error",
        "Проверьте номер телефона — нужно не меньше 10 цифр.",
      );
      return;
    }

    if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      showStatus(
        status,
        "error",
        "Форма ещё не подключена к отправке. Позвоните нам — номер в разделе «Контакты».",
      );
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Отправляем...";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showStatus(
          status,
          "success",
          "Заявка отправлена! Администратор перезвонит вам в ближайшее время.",
        );
        form.reset();
      } else {
        showStatus(
          status,
          "error",
          "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
        );
      }
    } catch {
      showStatus(
        status,
        "error",
        "Нет соединения с интернетом. Попробуйте ещё раз или позвоните нам.",
      );
    } finally {
      button.disabled = false;
      button.textContent = "Записаться";
    }
  });
}

function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("cookie-accept");
  if (!banner || !accept) return;

  let consented = null;
  try {
    consented = localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    consented = null;
  }

  if (consented !== "1") banner.hidden = false;

  accept.addEventListener("click", () => {
    banner.hidden = true;
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "1");
    } catch {
      return;
    }
  });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForm();
  initCookieBanner();
  initYear();
});
