import CardDrawer from "./CardDrawer.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter, qs, setClick } from "./utils.mjs";

async function run() {
  await loadHeaderFooter();
}

run();

let coin2 = {
  id: "90",
  symbol: "BTC",
  name: "Bitcoin",
  nameid: "bitcoin",
  rank: 1,
  price_usd: "112547.91",
  percent_change_24h: "-0.80",
  percent_change_1h: "0.34",
  percent_change_7d: "-7.24",
  price_btc: "1.00",
  market_cap_usd: "2242477188338.00",
  volume24: 75070814128.8291,
  volume24a: 60523276685.88413,
  csupply: "19924646.00",
  tsupply: "19924646",
  msupply: "21000000",
};
qs("#cards").classList.remove("hidden");
new CardDrawer(coin2).edit("#cards");

const service = new ExternalServices();
const list = qs("#search-list");
const cards = qs("#cards");

setClick("#search-crypto-btn", async () => {
  const query = qs("#search-crypto").value.trim();
  if (!query) return;

  // clear list
  list.innerHTML = `<li class="flex items-center justify-start gap-2"> <div class="border-gray-300 inline-block h-6 w-6 animate-spin rounded-full border-4 border-t-blue-800"></div>Searching...</li>`;

  const coin = await service.findCoin(query);

  if (!coin) {
    list.innerHTML = "<li>No results found</li>";
    return;
  }

  const li = document.createElement("li");
  li.textContent = coin.name;
  li.dataset.id = coin.id;
  li.classList.add(
    "coin-item",
    "py-2",
    "px-4",
    "shadow-md",
    "bg-white",
    "hover:bg-gray-200",
    "rounded-md",
    "cursor-pointer",
  );

  list.innerHTML = ""; // clear old ones
  list.appendChild(li);
});

list.addEventListener("click", (e) => {
  const li = e.target.closest(".coin-item");
  if (!li) return;

  const id = li.dataset.id;
  onCoinSelected(id);
});

// Function that receives the coin id
async function onCoinSelected(id) {
  cards.innerHTML = `
    <h2 class="text-xl text-blue-800 mb-2">Now choose the data you want</h2>
    <div class="flex items-center justify-start gap-2"> <div class="border-gray-300 inline-block h-6 w-6 animate-spin rounded-full border-4 border-t-blue-800"></div>Searching...</div>
  `;

  const coin = await service.getCurrentCoinStatus(id);

  if (!coin) {
    cards.innerHTML = "Sorry we couldn't load that crypto right now :(";
  } else {
    list.innerHTML = "";
    cards.innerHTML = "";
    qs("#title-cards").classList.remove("hidden");
    new CardDrawer(coin).edit("#cards");
  }
}
