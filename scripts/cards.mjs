import { loadTemplate, openModal, qs } from "./utils.mjs";

export async function createNewCard() {
  const form = await loadTemplate("../partials/create-card.html");

  openModal(form);
}
