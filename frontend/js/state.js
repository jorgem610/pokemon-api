
const API_URL = "http://127.0.0.1:8000";


const TYPE_STYLES = {
  fuego:      { icon: "local_fire_department" },
  agua:       { icon: "water_drop" },
  planta:     { icon: "eco" },
  electrico:  { icon: "bolt" },
  eléctrico:  { icon: "bolt" },
  psiquico:   { icon: "psychology" },
  psíquico:   { icon: "psychology" },
  roca:       { icon: "landscape" },
  volador:    { icon: "air" },
};

function typeIcon(name) {
  const key = (name || "").toLowerCase();
  return TYPE_STYLES[key]?.icon || "hexagon";
}


const appState = {
  allTypes: [],
  allPokemon: [],
  activeTypeFilter: "",
  searchQuery: "",
  pendingDeleteAction: null,
};