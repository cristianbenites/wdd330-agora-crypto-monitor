export default class Card {
  constructor(data, config) {
    this.data = data;
    this.config = config;

    this.card = document.createElement("div");
    this.card.className =
      "max-w-fit bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up";

    this.template = `
      <h3 class="text-xl font-bold text-indigo-800" data-key="symbol"></h3>
      <h2 class="text-4xl md:text-4xl text-blue-900" data-key="price_usd">
        <strong></strong>
      </h2>
      <h3 class="text-lg font-bold text-indigo-800" data-key="price_btc"></h3>

      <div class="grid grid-cols-2 w-full mt-2" data-section="percents"></div>

      <div data-section="market-cap" class="mt-2">
        <h4 class="text-lg flex items-center text-gray-600">
          <span class="material-icons-outlined mr-2">account_balance</span>
          <span>Market Cap:&nbsp;</span>
          <span data-key="market_cap_usd"></span>
        </h4>
      </div>
    `;
  }

  formatUSD(value) {
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  percentInfo(value) {
    const num = parseFloat(value);
    const up = num >= 0;
    return {
      num,
      color: up ? "text-green-800" : "text-red-800",
      icon: up ? "arrow_upward" : "arrow_downward",
    };
  }

  fieldVisible(key) {
    const field = this.config.find((f) => f.key === key);
    return field && field.show;
  }

  populateSymbol(fragment) {
    const el = fragment.querySelector('[data-key="symbol"]');
    if (!el) return;

    const showSymbol = this.fieldVisible("symbol");
    const showName = this.fieldVisible("name");

    if (!showSymbol && !showName) {
      el.remove();
      return;
    }

    const symbol = showSymbol ? this.data.symbol : "";
    const name = showName ? this.data.name : "";

    el.textContent = [symbol, name].filter(Boolean).join(" - ");
  }

  populatePrice(fragment) {
    const usdEl = fragment.querySelector('[data-key="price_usd"]');
    if (!this.fieldVisible("price_usd")) {
      usdEl && usdEl.remove();
      return;
    }
    if (usdEl)
      usdEl.querySelector("strong").textContent = this.formatUSD(
        this.data.price_usd ?? 0,
      );

    const btcEl = fragment.querySelector('[data-key="price_btc"]');
    if (!this.fieldVisible("price_btc")) {
      btcEl && btcEl.remove();
      return;
    }

    if (btcEl) {
      btcEl.textContent = `Price BTC: ${this.data["price_btc"] ?? 0}`;
    }
  }

  populatePercents(fragment) {
    const container = fragment.querySelector('[data-section="percents"]');
    const percentKeys = [
      "percent_change_24h",
      "percent_change_1h",
      "percent_change_7d",
    ];

    percentKeys.forEach((key) => {
      if (!this.fieldVisible(key)) return;
      const raw = this.data[key];
      if (raw == null || raw === "") return;

      const { color, icon } = this.percentInfo(raw);
      const label = this.config.find((f) => f.key === key)?.label ?? key;

      const div = document.createElement("div");
      div.className =
        "text-gray-600 text-lg hover:bg-gray-200 flex items-center p-1 rounded-md";

      // use safe formatting: show plus sign for positive
      const n = parseFloat(raw);
      const formatted = Number.isNaN(n) ? raw : n > 0 ? `+${n}` : `${n}`;

      div.innerHTML = `
        <span class="material-icons-outlined ${color}">${icon}</span>
        <span class="${color}">${formatted}%</span>
        <span>&nbsp;(${label.replace("% ", "")})</span>
      `;
      container.appendChild(div);
    });

    if (!container.childElementCount) container.remove();
  }

  populateMarketCap(fragment) {
    const marketCapSection = fragment.querySelector(
      '[data-section="market-cap"]',
    );
    if (!this.fieldVisible("market_cap_usd")) {
      marketCapSection && marketCapSection.remove();
      return;
    }

    marketCapSection.classList.remove("hidden");

    const textValue = fragment.querySelector('[data-key="market_cap_usd"]');
    textValue.innerText = this.formatUSD(this.data["market_cap_usd"] ?? 0);
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template.trim();
    const fragment = template.content;

    this.populateSymbol(fragment);
    this.populatePrice(fragment);
    this.populatePercents(fragment);
    this.populateMarketCap(fragment);

    this.card.appendChild(fragment);
    return this.card;
  }
}
