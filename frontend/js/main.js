

document.addEventListener("components:loaded", () => {
  initTabs();
  initModalGenericClosers();
  initSteppers();
  initSearch();
  initConfirmModal();
  initPokemonFormListeners();
  initTypeFormListeners();

  loadTypes().then(loadPokemon);
});