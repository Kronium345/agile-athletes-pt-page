import CONFIG from "./config.js";
import { showAlert } from "./alert.js";

const {
  CONTACT_EMAIL,
  MAILTO_SUBJECT,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} = CONFIG;

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const form = document.getElementById("partner-form");
const submitBtn = document.getElementById("partner-submit");
const emailJsReady =
  EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;

const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      showAlert("Please check the highlighted fields and try again.", "error");
      return;
    }

    const data = new FormData(form);
    const payload = {
      from_name: data.get("name"),
      reply_to: data.get("email"),
      user_email: data.get("email"),
      handle: data.get("handle"),
      location: data.get("location"),
      specialties: data.get("specialties") || "—",
      message: data.get("message") || "—",
    };

    if (emailJsReady) {
      sendViaEmailJs(payload);
    } else {
      sendViaMailto(payload);
    }
  });
}

async function sendViaEmailJs(payload) {
  setSubmitting(true);

  try {
    const response = await fetch(EMAILJS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: payload,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Request failed (${response.status})`);
    }

    form.reset();
    showAlert(
      "Thanks — we received your enquiry and will be in touch soon.",
      "success"
    );
  } catch (error) {
    console.error("EmailJS error:", error);
    const detail = error?.message || "Unknown error — check the browser console.";
    showAlert(
      `Could not send your message (${detail}). Email us at ${CONTACT_EMAIL}.`,
      "error"
    );
  } finally {
    setSubmitting(false);
  }
}

function sendViaMailto(payload) {
  const body = [
    "Name: " + payload.from_name,
    "Email: " + payload.reply_to,
    "Instagram / LinkedIn: " + payload.handle,
    "Location: " + payload.location,
    "Specialties: " + payload.specialties,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const mailto =
    "mailto:" +
    encodeURIComponent(CONTACT_EMAIL) +
    "?subject=" +
    encodeURIComponent(MAILTO_SUBJECT) +
    "&body=" +
    encodeURIComponent(body);

  showAlert(
    "Opening your email app… If nothing opens, email us at " + CONTACT_EMAIL,
    "success"
  );

  window.location.href = mailto;
}

function setSubmitting(isSubmitting) {
  if (!submitBtn) return;
  submitBtn.disabled = isSubmitting;
  submitBtn.textContent = isSubmitting
    ? "Sending…"
    : "Request early partner info";
}

function validateForm(formEl) {
  let isValid = true;
  const requiredFields = formEl.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    const group = field.closest(".form-group");
    if (!field.value.trim()) {
      group.classList.add("has-error");
      isValid = false;
    } else {
      group.classList.remove("has-error");
    }
  });

  const emailField = formEl.querySelector('[name="email"]');
  if (emailField && emailField.value.trim()) {
    const emailGroup = emailField.closest(".form-group");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      emailGroup.classList.add("has-error");
      isValid = false;
    }
  }

  return isValid;
}

document
  .querySelectorAll("#partner-form input, #partner-form textarea")
  .forEach((field) => {
    field.addEventListener("input", () => {
      const group = field.closest(".form-group");
      if (group) group.classList.remove("has-error");
    });
  });
