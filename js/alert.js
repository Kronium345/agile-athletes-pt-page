export function showAlert(message, type = "info") {
  const existing = document.getElementById("alert-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "alert-modal";
  overlay.className = "alert-modal-overlay";

  const title = type === "error" ? "Something went wrong" : "Message sent";

  overlay.innerHTML = `
    <div class="alert-modal" role="alertdialog" aria-modal="true" aria-labelledby="alert-modal-title">
      <p id="alert-modal-title" class="alert-modal__title">${title}</p>
      <p class="alert-modal__message"></p>
      <button type="button" class="btn btn-primary alert-modal__ok">OK</button>
    </div>
  `;

  overlay.querySelector(".alert-modal__message").textContent = message;
  overlay.classList.toggle("alert-modal-overlay--error", type === "error");

  const close = () => overlay.remove();

  overlay.querySelector(".alert-modal__ok").addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.body.appendChild(overlay);
  overlay.querySelector(".alert-modal__ok").focus();
}
