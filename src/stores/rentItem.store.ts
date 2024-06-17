import { create } from "zustand";

interface rentItemStore {
    totalAmount: number;
    setTotalAmount: (totalAmount: number) => void;
}

const useRentItemStore = create<rentItemStore>(set => ({
    totalAmount: 0,
    setTotalAmount: (totalAmount: number) => set(state => ({ ...state, totalAmount }))
}));

export default useRentItemStore;