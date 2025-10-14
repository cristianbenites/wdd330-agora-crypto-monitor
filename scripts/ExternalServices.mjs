import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const AVAILABLE_COINS = "available_coins";
const PAGE_SIZE = 100;

const baseURL = "https://api.coinlore.net/api/";

async function paginateTickers(start) {
  const response = await fetch(
    `${baseURL}tickers/?start=${start}&limit=${PAGE_SIZE}`,
  );
  if (!response.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default class ExternalServices {
  constructor() {}

  async findCoin(query) {
    query = query.trim().toLowerCase();
    let coins = getLocalStorage(AVAILABLE_COINS) || [];

    let found = coins.find(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.symbol.toLowerCase().includes(query),
    );
    if (found) return found;

    let start = coins.length;

    // continue fetching new pages
    while (true) {
      const list = paginateTickers(start);

      if (list.length === 0) break;

      const mapped = list.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        nameid: c.nameid,
      }));

      coins = [...coins, ...mapped];
      setLocalStorage(AVAILABLE_COINS, coins);

      found = mapped.find(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.symbol.toLowerCase().includes(query),
      );

      if (found) return found;

      start += PAGE_SIZE;
    }

    return null;
  }

  async getCurrentCoinStatus(id) {
    const response = await fetch(`${baseURL}/ticker/?id=${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  }
}
