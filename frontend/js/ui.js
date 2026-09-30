
function initTabs() {
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      document.getElementById(tab).classList.add("active");

      document.querySelectorAll("[data-tab]").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(`[data-tab="${tab}"]`).forEach((b) => b.classList.add("active"));
    });
  });
}


function openModal(overlayId) {
  document.getElementById(overlayId).classList.add("open");
}
function closeModal(overlayId) {
  document.getElementById(overlayId).classList.remove("open");
}
function initModalGenericClosers() {
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
}


function initSteppers() {
  document.querySelectorAll(".stepper-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.step; // "level" | "hp"
      const dir = parseInt(btn.dataset.dir, 10);
      const input = document.getElementById(`pokemon-${field}`);
      const min = parseInt(input.min || "1", 10);
      const max = parseInt(input.max || "999", 10);
      let value = parseInt(input.value || "0", 10) + dir;
      value = Math.max(min, Math.min(max, value));
      input.value = value;
    });
  });
}


function confirmDelete(message, onAccept) {
  document.getElementById("confirm-message").textContent = message;
  appState.pendingDeleteAction = onAccept;
  openModal("confirm-modal-overlay");
}

function initConfirmModal() {
  document.getElementById("confirm-cancel").addEventListener("click", () => {
    appState.pendingDeleteAction = null;
    closeModal("confirm-modal-overlay");
  });
  document.getElementById("confirm-accept").addEventListener("click", () => {
    if (appState.pendingDeleteAction) appState.pendingDeleteAction();
    appState.pendingDeleteAction = null;
    closeModal("confirm-modal-overlay");
  });
}


function initSearch() {
  document.getElementById("search-pokemon").addEventListener("input", (e) => {
    appState.searchQuery = e.target.value;
    renderPokemonGrid(); // definida en pokemon.js
  });
}