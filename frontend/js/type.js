

async function loadTypes() {
  try {
    appState.allTypes = await api.getTypes();
    renderTypeChipsInForm();
    renderTypeFilterChips();
    renderTypesList();
    document.getElementById("stat-types").textContent = `${appState.allTypes.length} Tipos`;
  } catch (err) {
    showToast("No se pudieron cargar los tipos", true);
    console.error(err);
  }
}


function renderTypeChipsInForm() {
  const container = document.getElementById("pokemon-types-chips");
  container.innerHTML = "";
  appState.allTypes.forEach((type) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "form-chip";
    chip.dataset.typeId = type.id;
    chip.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">${typeIcon(type.name)}</span> ${type.name}`;
    chip.addEventListener("click", () => chip.classList.toggle("selected"));
    container.appendChild(chip);
  });
}


function renderTypeFilterChips() {
  const scroller = document.getElementById("filter-type-scroller");
  scroller.innerHTML = `<button class="type-chip active" data-type-id="">Todos</button>`;
  appState.allTypes.forEach((type) => {
    const chip = document.createElement("button");
    chip.className = "type-chip";
    chip.dataset.typeId = type.id;
    chip.textContent = type.name;
    scroller.appendChild(chip);
  });

  scroller.querySelectorAll(".type-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      scroller.querySelectorAll(".type-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      appState.activeTypeFilter = chip.dataset.typeId;
      renderPokemonGrid(); // definida en pokemon.js
    });
  });
}


function renderTypesList() {
  const list = document.getElementById("types-list");
  if (appState.allTypes.length === 0) {
    list.innerHTML = `<p class="status-msg">Todavía no hay tipos creados.</p>`;
    return;
  }

  list.innerHTML = ""; // limpia la lista antes de repintar
  appState.allTypes.forEach((type) => {
    const rowNode = TypeRow(type, {
      onEdit: () => openTypeModalForEdit(type.id),
      onDelete: () =>
        confirmDelete("¿Eliminar este tipo? Los Pokémon que lo tengan lo perderán.", () =>
          deleteType(type.id)
        ),
    });
    list.appendChild(rowNode);
  });
}


function openTypeModalForCreate() {
  document.getElementById("type-modal-title").textContent = "Añadir Tipo";
  document.getElementById("type-id").value = "";
  document.getElementById("type-name").value = "";
  document.getElementById("type-form-error").classList.add("hidden");
  openModal("type-modal-overlay");
}

function openTypeModalForEdit(id) {
  const type = appState.allTypes.find((t) => String(t.id) === String(id));
  if (!type) return;
  document.getElementById("type-modal-title").textContent = "Editar Tipo";
  document.getElementById("type-id").value = type.id;
  document.getElementById("type-name").value = type.name;
  document.getElementById("type-form-error").classList.add("hidden");
  openModal("type-modal-overlay");
}

async function submitTypeForm(e) {
  e.preventDefault();
  const errorEl = document.getElementById("type-form-error");
  errorEl.classList.add("hidden");

  const id = document.getElementById("type-id").value;
  const payload = { name: document.getElementById("type-name").value.trim() };

  try {
    if (id) {
      await api.updateType(id, payload);
      showToast("Tipo actualizado");
    } else {
      await api.createType(payload);
      showToast("Tipo creado");
    }
    closeModal("type-modal-overlay");
    await loadTypes();
    await loadPokemon(); // por si algún pokemon usa este tipo, refrescamos sus chips
  } catch (err) {
    errorEl.textContent = extractErrorMessage(err, "Error al guardar el tipo.");
    errorEl.classList.remove("hidden");
    console.error(err);
  }
}

async function deleteType(id) {
  try {
    await api.deleteType(id);
    showToast("Tipo eliminado");
    await loadTypes();
    await loadPokemon();
  } catch (err) {
    showToast("Error al eliminar el tipo", true);
    console.error(err);
  }
}

function initTypeFormListeners() {
  document.getElementById("open-type-modal").addEventListener("click", openTypeModalForCreate);
  document.getElementById("close-type-modal").addEventListener("click", () => closeModal("type-modal-overlay"));
  document.getElementById("cancel-type-modal").addEventListener("click", () => closeModal("type-modal-overlay"));
  document.getElementById("type-form").addEventListener("submit", submitTypeForm);
}