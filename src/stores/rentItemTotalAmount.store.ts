import { create } from "zustand";

interface rentItemTotalAmountStore {
    totalAmount: number;
    setTotalAmount: (totalAmount: number) => void;
}

const useRentItemTotalAmountStore = create<rentItemTotalAmountStore>(set => ({
    totalAmount: 0,
    setTotalAmount: (totalAmount: number) => set(state => ({ ...state, totalAmount }))
}));

export default useRentItemTotalAmountStore;