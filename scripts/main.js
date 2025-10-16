import CardLoader from "./CardLoader.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const loader = new CardLoader(service);

loader.reloadAllCards();

// refresh every minute
setInterval(loader.reloadAllCards, 60000);
