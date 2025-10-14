import { createNewCard } from "./cards.mjs";
import { loadHeaderFooter, qs, runCloseModal, setClick } from "./utils.mjs";

function makeHeaderDynamic() {
  setClick("#new-card", createNewCard);
}

async function run() {
  await loadHeaderFooter();
  //makeHeaderDynamic();
}

run();
runCloseModal();
