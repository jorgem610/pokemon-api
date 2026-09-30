

function PokemonCard(pokemon, handlers) {
  const template = document.getElementById("pokemon-card-template");
  const node = template.content.cloneNode(true);

  node.querySelector(".pokemon-name").textContent = pokemon.name;
  node.querySelector(".level-value").textContent = pokemon.level;
  node.querySelector(".hp-value").textContent = `${pokemon.hp} HP`;

 
  const imageEl = node.querySelector(".pokemon-image");
  if (pokemon.image_url) {
    imageEl.src = `${API_URL}${pokemon.image_url}`;
    imageEl.alt = pokemon.name;
    imageEl.classList.remove("hidden");
  }


  const typesContainer = node.querySelector(".type-chips-row");
  const badgeTemplate = document.getElementById("type-badge-template");
  pokemon.types.forEach((type) => {
    const badge = badgeTemplate.content.cloneNode(true);
    badge.querySelector(".type-badge-icon").textContent = typeIcon(type.name);
    badge.querySelector(".type-badge-name").textContent = type.name;
    typesContainer.appendChild(badge);
  });

  node.querySelector(".edit-btn").addEventListener("click", handlers.onEdit);
  node.querySelector(".delete-btn").addEventListener("click", handlers.onDelete);

  return node;
}