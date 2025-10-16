import CardEditor from "./CardEditor.mjs";
import CoinSearcher from "./CoinSearcher.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter, qs, setClick } from "./utils.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const list = qs("#search-list");
const cards = qs("#cards");

const coinSearcher = new CoinSearcher(service);

setClick("#search-crypto-btn", coinSearcher.search.bind(coinSearcher));
qs("#search-crypto").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    coinSearcher.search.bind(coinSearcher)();
  }
});
list.addEventListener("click", handleCoinSelected);

function handleCoinSelected(e) {
  const li = e.target.closest(".coin-item");
  if (!li) return;

  const id = li.dataset.id;
  runCoinCardEditor(id);
}

async function runCoinCardEditor(id) {
  cards.innerHTML = `
    <h2 class="text-xl text-blue-800 mb-2">Now choose the data you want</h2>
    <div class="flex items-center justify-start gap-2"> <div class="border-gray-300 inline-block h-6 w-6 animate-spin rounded-full border-4 border-t-blue-800"></div>Searching...</div>
  `;

  const coinList = await service.getCurrentCoinStatus(id);

  if (coinList.length < 1) {
    cards.innerHTML = "Sorry we couldn't load that crypto right now :(";
  } else {
    list.innerHTML = "";
    cards.innerHTML = "";
    qs("#title-cards").classList.remove("hidden");
    new CardEditor(coinList[0]).edit("#cards");
  }
}
