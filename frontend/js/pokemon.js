

async function loadPokemon() {
  const status = document.getElementById("pokemon-status");
  status.textContent = "Cargando Pokémon...";
  try {
    appState.allPokemon = await api.getPokemon();
    document.getElementById("stat-total").textContent = `${appState.allPokemon.length} Pokémon`;
    status.textContent = "";
    renderPokemonGrid();
  } catch (err) {
    status.textContent = "No se pudieron cargar los Pokémon.";
    showToast("Error al cargar Pokémon", true);
    console.error(err);
  }
}

// Pinta la cuadrícula aplicando el filtro por tipo y la búsqueda por nombre,
// usando el componente PokemonCard para cada elemento.
function renderPokemonGrid() {
  const grid = document.getElementById("pokemon-grid");
  let filtered = appState.allPokemon;

  if (appState.activeTypeFilter) {
    filtered = filtered.filter((p) =>
      p.types.some((t) => String(t.id) === String(appState.activeTypeFilter))
    );
  }
  if (appState.searchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(appState.searchQuery.toLowerCase())
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="status-msg">No hay Pokémon que coincidan.</p>`;
    return;
  }

  grid.innerHTML = ""; // limpia el grid antes de repintar
  filtered.forEach((pokemon) => {
    const cardNode = PokemonCard(pokemon, {
      onEdit: () => openPokemonModalForEdit(pokemon.id),
      onDelete: () => confirmDelete("¿Eliminar este Pokémon?", () => deletePokemon(pokemon.id)),
    });
    grid.appendChild(cardNode);
  });
}


function resetImagePreview() {
  const preview = document.getElementById("pokemon-image-preview");
  preview.src = "";
  preview.classList.add("hidden");
  document.getElementById("pokemon-image-placeholder").classList.remove("hidden");
  document.getElementById("pokemon-image-remove").classList.add("hidden");
}

function setImagePreview(src) {
  const preview = document.getElementById("pokemon-image-preview");
  preview.src = src;
  preview.classList.remove("hidden");
  document.getElementById("pokemon-image-placeholder").classList.add("hidden");
  document.getElementById("pokemon-image-remove").classList.remove("hidden");
}


function openPokemonModalForCreate() {
  document.getElementById("pokemon-modal-title").textContent = "Añadir Pokémon";
  document.getElementById("pokemon-id").value = "";
  document.getElementById("pokemon-name").value = "";
  document.getElementById("pokemon-level").value = 50;
  document.getElementById("pokemon-hp").value = 100;
  document.getElementById("pokemon-form-error").classList.add("hidden");
  document.getElementById("pokemon-image").value = "";
  resetImagePreview();
  document.querySelectorAll("#pokemon-types-chips .form-chip").forEach((c) => c.classList.remove("selected"));
  openModal("pokemon-modal-overlay");
}

function openPokemonModalForEdit(id) {
  const pokemon = appState.allPokemon.find((p) => String(p.id) === String(id));
  if (!pokemon) return;

  document.getElementById("pokemon-modal-title").textContent = "Editar Pokémon";
  document.getElementById("pokemon-id").value = pokemon.id;
  document.getElementById("pokemon-name").value = pokemon.name;
  document.getElementById("pokemon-level").value = pokemon.level;
  document.getElementById("pokemon-hp").value = pokemon.hp;
  document.getElementById("pokemon-form-error").classList.add("hidden");
  document.getElementById("pokemon-image").value = "";
  if (pokemon.image_url) {
    setImagePreview(`${API_URL}${pokemon.image_url}`);
  } else {
    resetImagePreview();
  }

  const selectedIds = pokemon.types.map((t) => String(t.id));
  document.querySelectorAll("#pokemon-types-chips .form-chip").forEach((chip) => {
    chip.classList.toggle("selected", selectedIds.includes(String(chip.dataset.typeId)));
  });

  openModal("pokemon-modal-overlay");
}

async function submitPokemonForm(e) {
  e.preventDefault();
  const errorEl = document.getElementById("pokemon-form-error");
  errorEl.classList.add("hidden");

  const id = document.getElementById("pokemon-id").value;
  const selectedTypeIds = Array.from(
    document.querySelectorAll("#pokemon-types-chips .form-chip.selected")
  ).map((chip) => parseInt(chip.dataset.typeId, 10));

  const payload = {
    name: document.getElementById("pokemon-name").value.trim(),
    level: parseInt(document.getElementById("pokemon-level").value, 10),
    hp: parseInt(document.getElementById("pokemon-hp").value, 10),
    type_ids: selectedTypeIds,
  };

  try {
    let savedPokemon;
    if (id) {
      savedPokemon = await api.updatePokemon(id, payload);
      showToast("Pokémon actualizado");
    } else {
      savedPokemon = await api.createPokemon(payload);
      showToast("Pokémon creado");
    }

    
    const imageInput = document.getElementById("pokemon-image");
    if (imageInput.files && imageInput.files[0]) {
      const formData = new FormData();
      formData.append("file", imageInput.files[0]);
      await api.uploadPokemonImage(savedPokemon.id, formData);
    }

    closeModal("pokemon-modal-overlay");
    loadPokemon();
  } catch (err) {
    errorEl.textContent = extractErrorMessage(err, "Error al guardar el Pokémon.");
    errorEl.classList.remove("hidden");
    console.error(err);
  }
}

async function deletePokemon(id) {
  try {
    await api.deletePokemon(id);
    showToast("Pokémon eliminado");
    loadPokemon();
  } catch (err) {
    showToast("Error al eliminar el Pokémon", true);
    console.error(err);
  }
}

function initPokemonFormListeners() {
  document.getElementById("open-pokemon-modal").addEventListener("click", openPokemonModalForCreate);
  document.getElementById("close-pokemon-modal").addEventListener("click", () => closeModal("pokemon-modal-overlay"));
  document.getElementById("cancel-pokemon-modal").addEventListener("click", () => closeModal("pokemon-modal-overlay"));
  document.getElementById("pokemon-form").addEventListener("submit", submitPokemonForm);

  document.getElementById("pokemon-image").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  });

  document.getElementById("pokemon-image-remove").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("pokemon-image").value = "";
    resetImagePreview();
  });
}