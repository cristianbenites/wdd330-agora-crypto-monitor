import Card from "./Card.mjs";
import SaveNotification from "./SaveNotification.mjs";
import {
  getLocalStorage,
  loadTemplate,
  qs,
  renderListWithTemplate,
  setClick,
  setLocalStorage,
} from "./utils.mjs";

const DRAWER_FORM_ID = "#displayable-list";
const DRAWER_CARD = "#editable-card";
const CHECKBOX_ITEM = "display-field";

const DISPLAYABLE_FIELDS = [
  { key: "symbol", label: "Symbol", show: true },
  { key: "name", label: "Name", show: true },
  { key: "price_usd", label: "Price USD", show: true },
  { key: "percent_change_24h", label: "% 24h", show: true },
  { key: "percent_change_1h", label: "% 1h", show: true },
  { key: "percent_change_7d", label: "% 7 days", show: true },
  { key: "price_btc", label: "Price BTC", show: true },
  { key: "market_cap_usd", label: "Market Cap", show: true },
];

function getCheckbox({ key, label, show }) {
  return `
    <label class="inline-flex items-center cursor-pointer">
      <span class="text-sm font-medium text-gray-700">${label}</span>
      <input type="checkbox" ${show && "checked"} value="${key}" class="sr-only peer ${CHECKBOX_ITEM}" />
      <div
        class="ms-2 relative w-10 h-4 bg-gray-400 cursor-pointer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
      ></div>
    </label>
  `;
}

function createSaveButton() {
  const btn = document.createElement("button");
  btn.id = "save-card";
  btn.className =
    "inline-block mt-4 px-4 py-2 rounded-full text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 transition-transform duration-300 hover:scale-105";
  btn.textContent = "Save Card";

  return btn;
}

async function createEditor(selector, data, config) {
  const editorHtml = await loadTemplate("../partials/card-editor.html");

  qs(selector).innerHTML = editorHtml;

  renderListWithTemplate(getCheckbox, qs(DRAWER_FORM_ID), DISPLAYABLE_FIELDS);

  const saveBtn = createSaveButton();
  qs(DRAWER_FORM_ID).appendChild(saveBtn);

  updateCard(data, config);
}

function updateCard(data, config) {
  const card = new Card(data, config).render();

  qs("#editable-card").innerHTML = "";
  qs("#editable-card").appendChild(card);
}

export default class CardDrawer {
  constructor(coin) {
    this.coin = coin;
    this.fields = [...DISPLAYABLE_FIELDS];
    this.notification = new SaveNotification();
  }

  async edit(selector) {
    await createEditor(selector, this.coin, this.fields);

    this.runEditor();
  }

  async saveCard() {
    let saved = getLocalStorage("saved-cards");

    if (saved) {
      saved = [...saved, this.fields];
    } else {
      saved = [this.fields];
    }

    setLocalStorage("saved-cards", saved);

    this.notification.show(() => (window.location.href = "/"));
  }

  runEditor() {
    const checkboxes = document.querySelectorAll(`.${CHECKBOX_ITEM}`);
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", () => {
        const target = this.fields.find((i) => i.key === checkbox.value);
        if (target) {
          target.show = checkbox.checked;
          updateCard(this.coin, this.fields);
        }
      }),
    );

    setClick("#save-card", this.saveCard.bind(this));
  }
}
