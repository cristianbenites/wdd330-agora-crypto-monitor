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

      <div class="grid grid-cols-2 w-full mt-2" data-section="percents"></div>

      <div data-section="alert">
        <h4 class="text-lg flex items-center text-gray-600">
          <span class="material-icons-outlined mr-2">alarm</span>
          <span data-key="show_alert"></span>
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
    const el = fragment.querySelector('[data-key="price_usd"]');
    if (!this.fieldVisible("price_usd")) return el?.remove?.();
    if (el)
      el.querySelector("strong").textContent = this.formatUSD(
        this.data.price_usd ?? 0,
      );
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

  populateAlert(fragment) {
    const alertSection = fragment.querySelector('[data-section="alert"]');
    if (!this.fieldVisible("show_alert")) return alertSection?.remove?.();

    // dynamic alert text: prefer data.alert or options.alertPrice, fallback to placeholder
    const alertTextEl = alertSection.querySelector('[data-key="show_alert"]');
    const alertVal =
      this.data.alertPrice ??
      this.options.alertPrice ??
      this.data.alert ??
      null;

    if (alertVal != null) {
      alertTextEl.textContent = `alert at ${this.formatUSD(alertVal)}`;
    } else {
      // if there's no alert value, remove section or put default text
      alertTextEl.textContent = `alert at ${this.formatUSD(this.data.price_usd ?? 0)}`;
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = this.template.trim();
    const fragment = template.content;

    this.populateSymbol(fragment);
    this.populatePrice(fragment);
    this.populatePercents(fragment);
    //this.populateAlert(fragment);

    this.card.appendChild(fragment);
    return this.card;
  }
}
