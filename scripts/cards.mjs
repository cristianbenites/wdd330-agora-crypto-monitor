import { loadTemplate, openModal, qs, setClick } from "./utils.mjs";

export async function createNewCard() {
  const form = await loadTemplate("../partials/create-card.html");

  openModal(form);

  setClick("search-crypto-btn", async () => {
    const response = await fetch("https://api.coinlore.net/api/tickers/");
    const data = await convertToJson(response);

    const prev = qs("#search-content");
    if (prev) {
      prev.remove();
    }

    const content = document.createElelemnt("div");
    content.id = "search-content";
    content.className = "flex";
    content.textContent = data;

    qs("modal-content").appendChild(content);
  });

  qs("search-crypto");
}

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}
