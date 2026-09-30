
async function loadComponents() {
  const includeNodes = Array.from(document.querySelectorAll("[data-include]"));

  await Promise.all(
    includeNodes.map(async (node) => {
      const path = node.getAttribute("data-include");
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`);
        const html = await res.text();
        node.outerHTML = html;
      } catch (err) {
        console.error(err);
        node.outerHTML = `<p style="color:red;">Error cargando ${path}</p>`;
      }
    })
  );

  document.dispatchEvent(new Event("components:loaded"));
}

document.addEventListener("DOMContentLoaded", loadComponents);