import { qs } from "./utils.mjs";

const INPUT_SEARCH = "#search-crypto";
const LIST_CONTAINER = "#search-list";

export default class CoinSearcher {
  constructor(service) {
    this.service = service;
    this.coin = null;
  }

  async search() {
    const query = qs(INPUT_SEARCH).value.trim();
    if (!query) return;

    this.clearListContainer();

    this.coin = await this.service.findCoin(query);
    if (!this.coin) {
      qs(LIST_CONTAINER).innerHTML = `
        <div class="no-results">
          <span class="material-icons bounce">search_off</span>
          <p>No results found</p>
        </div>
      `;
      return;
    }

    this.drawList();
  }

  clearListContainer() {
    qs(LIST_CONTAINER).innerHTML =
      `<li class="flex items-center justify-start gap-2"> <div class="border-gray-300 inline-block h-6 w-6 animate-spin rounded-full border-4 border-t-blue-800"></div>Searching...</li>`;
  }

  drawList() {
    const li = document.createElement("li");
    li.textContent = `${this.coin.symbol} - ${this.coin.name}`;
    li.dataset.id = this.coin.id;
    li.className =
      "coin-item py-2 px-4 shadow-md bg-white hover:bg-gray-200 rounded-md cursor-pointer";

    qs(LIST_CONTAINER).innerHTML = ""; // clear old ones
    qs(LIST_CONTAINER).appendChild(li);
  }
}
