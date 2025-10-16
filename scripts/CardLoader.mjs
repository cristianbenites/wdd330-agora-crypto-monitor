import Card from "./Card.mjs";
import { getLocalStorage, qs, setLocalStorage } from "./utils.mjs";

const DASHBOARD = "#main-dashboard";

export default class CardLoader {
  constructor(service) {
    this.cards = [];
    this.service = service;
  }

  async reloadAllCards() {
    this.cards = getLocalStorage("saved-cards");

    if (!this.cards) return;
    if (this.cards.length == 0) return;

    const ids = this.cards.map((card) => card.apiId).join(",");

    const coins = await this.service.getCurrentCoinStatus(ids);

    const cardElements = [];

    this.cards.forEach((card) => {
      const data = coins.find((coin) => coin.id == card.apiId);

      if (!data) return;

      cardElements.push(
        new Card(data, card.fields, card.id, true, (id) =>
          this.deleteCard.bind(this)(id),
        ).render(),
      );
    });

    const dashboard = qs(DASHBOARD);
    this.clearDashboard();
    cardElements.forEach((el) => dashboard.appendChild(el));
  }

  clearDashboard() {
    qs(DASHBOARD).innerHTML = "";
  }

  deleteCard(id) {
    const filtered = this.cards.filter((card) => card.id !== id);
    setLocalStorage("saved-cards", filtered);
    this.reloadAllCards();
  }
}
