import { DeviceListItem } from "src/types";
import { create } from "zustand";

interface BasketStore {
    basketItems: DeviceListItem[];
    setBasketItems: (basketItems: DeviceListItem[]) => void;
}

const useBasketStore = create<BasketStore>(set => ({
    basketItems: [],
    setBasketItems: (basketItems: DeviceListItem[]) => set(state => ({ ...state, basketItems }))
}));

export default useBasketStore;
