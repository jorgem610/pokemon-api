
function TypeRow(type, handlers) {
  const template = document.getElementById("type-row-template");
  const node = template.content.cloneNode(true);

  node.querySelector(".type-row-name").textContent = type.name;
  node.querySelector(".type-row-id").textContent = `ID: ${type.id}`;

  node.querySelector(".edit-btn").addEventListener("click", handlers.onEdit);
  node.querySelector(".delete-btn").addEventListener("click", handlers.onDelete);

  return node;
}