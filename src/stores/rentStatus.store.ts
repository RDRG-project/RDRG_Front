import { create } from "zustand";

interface rentStatusStore {
    rentStatus: boolean;
    setRentStatus: (rentStatus: boolean) => void;
}

const useRentStatusStore = create<rentStatusStore>(set => ({
    rentStatus: false,
    setRentStatus: (rentStatus: boolean) => set(state => ({ ...state, rentStatus }))
}));

export default useRentStatusStore;