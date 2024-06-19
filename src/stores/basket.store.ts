import { create } from "zustand";

import { DeviceListItem } from "src/types";

interface BasketStore {
    basketItems: DeviceListItem[];
    setBasketItems: (basketItems: DeviceListItem[]) => void;
    totalAmount: number;
    setTotalAmount: (totalAmount: number) => void;
}

const useBasketStore = create<BasketStore>(set => ({
    basketItems: [],
    setBasketItems: (basketItems: DeviceListItem[]) => set(state => ({ ...state, basketItems })),
    totalAmount: 0,
    setTotalAmount: (totalAmount: number) => set(state => ({ ...state, totalAmount }))
}));

export default useBasketStore;