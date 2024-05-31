import { create } from "zustand";

interface rentStatusStore {
    rentStatus: string;
    setRentStatus: (rentStatus: string) => void;
}

const useRentStatusStore = create<rentStatusStore>(set => ({
    rentStatus: '',
    setRentStatus: (rentStatus: string) => set(state => ({ ...state, rentStatus }))
}));

export default useRentStatusStore;