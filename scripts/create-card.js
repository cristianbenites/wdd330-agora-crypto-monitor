import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter, qs, runCloseModal, setClick } from "./utils.mjs";

async function run() {
  await loadHeaderFooter();
}

run();
runCloseModal();

const service = new ExternalServices();
const list = qs("#search-list");

setClick("#search-crypto-btn", async () => {
  const query = qs("#search-crypto").value.trim();
  if (!query) return;

  // clear list
  list.innerHTML = "<li>Searching...</li>";

  const coin = await service.findCoin(query);

  if (!coin) {
    list.innerHTML = "<li>No results found</li>";
    return;
  }

  const li = document.createElement("li");
  li.textContent = coin.name;
  li.dataset.id = coin.id;
  li.classList.add("coin-item");

  list.innerHTML = ""; // clear old ones
  list.appendChild(li);
});

// Click listener (event delegation)
list.addEventListener("click", (e) => {
  const li = e.target.closest(".coin-item");
  if (!li) return;

  const id = li.dataset.id;
  onCoinSelected(id);
});

// Function that receives the coin id
async function onCoinSelected(id) {
  const cards = qs("#cards");

  cards.innerHTML = `<div>empty loading Card</div>`;

  const coin = await service.getCurrentCoinStatus(id);

  if (!coin) {
    cards.innerHTML = "Sorry we couldn't load that crypto right now :(";
  }

  cards.innerHTML = `${coin.id}, ${coin.name}`;
}
