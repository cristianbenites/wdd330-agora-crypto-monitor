import {
  loadTemplate,
  qs,
  renderListWithTemplate,
  setClick,
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
  { key: "show_alert", label: "Show alert", show: true },
];

function getCheckbox({ key, label, show }) {
  return `
    <label class="inline-flex items-center cursor-pointer">
      <span class="text-sm font-medium text-gray-700">${label}</span>
      <input type="checkbox" ${show && "checked"} value="${key}" class="sr-only peer ${CHECKBOX_ITEM}" />
      <div
        class="ms-2 relative w-10 h-4 bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
      ></div>
    </label>
  `;
}

async function createDefaultEditor(selector) {
  const editorHtml = await loadTemplate("../partials/card-editor.html");
  const defaultCard = await loadTemplate("../partials/simple-card.html");

  qs(selector).innerHTML = editorHtml;

  renderListWithTemplate(getCheckbox, qs(DRAWER_FORM_ID), DISPLAYABLE_FIELDS);

  qs(DRAWER_CARD).innerHTML = defaultCard;
}

function updateCard(fields, entries) {

  fields.forEach(field => {
    const el = qs(`#${field.key}`);
    const elValue = qs(`data-place-value="${field.key}"`);

    // TODO
    elValue.innerText = entries.find()


    field.
  })

}

export default class CardDrawer {
  constructor(coin) {
    this.coin = coin;
    this.fields = [...DISPLAYABLE_FIELDS];
  }

  async edit(selector) {
    await createDefaultEditor(selector);

    this.runEditor();
  }

  runEditor() {
    const checkboxes = document.querySelectorAll(`.${CHECKBOX_ITEM}`);
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", () => {
        const target = this.fields.find((i) => i.key === checkbox.value);
        if (target) {
          target.show = checkbox.checked;
        }
      }),
    );
  }
}
