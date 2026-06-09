import { ShopState, defaultShopState, EquippedCosmetics } from "./shop-types";

const SHOP_KEY = "calisthenics-os:shop:v1";

export function loadShopState(): ShopState {
  if (typeof window === "undefined") return defaultShopState();
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    if (!raw) return defaultShopState();
    const parsed = JSON.parse(raw) as ShopState;
    if (!parsed.ownedItemIds)    parsed.ownedItemIds    = [];
    if (!parsed.equipped)        parsed.equipped        = defaultShopState().equipped;
    if (!parsed.purchaseHistory) parsed.purchaseHistory = [];
    if (parsed.totalSpent === undefined) parsed.totalSpent = 0;
    if (!parsed.equipped.themeId) parsed.equipped.themeId = "default";
    return parsed;
  } catch {
    return defaultShopState();
  }
}

export function saveShopState(state: ShopState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHOP_KEY, JSON.stringify(state));
  } catch {}
}

export function purchaseItem(state: ShopState, itemId: string, price: number): ShopState {
  if (state.ownedItemIds.includes(itemId)) return state;
  return {
    ...state,
    ownedItemIds:    [...state.ownedItemIds, itemId],
    totalSpent:      state.totalSpent + price,
    purchaseHistory: [...state.purchaseHistory, { itemId, timestamp: Date.now(), price }],
  };
}

export function equipItem(state: ShopState, category: keyof EquippedCosmetics, itemId: string | null): ShopState {
  return { ...state, equipped: { ...state.equipped, [category]: itemId } };
}
