import { ItRentList } from "src/types";
import { create } from "zustand";

interface BasketStore {
    basketItems: ItRentList[];
    setBasketItems: (basketItems: ItRentList[]) => void;
}

const useBasketStore = create<BasketStore>(set => ({
    basketItems: [],
    setBasketItems: (basketItems: ItRentList[]) => set(state => ({ ...state, basketItems }))
}));

export default useBasketStore;
