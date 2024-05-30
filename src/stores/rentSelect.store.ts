import { ItRentList } from "src/types";
import { create } from "zustand";

interface RentSelectStore {
    rentSelectedItem: string;
    setRentSelectedItem: (rentSelectedItem: string) => void;
}

const useRentSelectStore = create<RentSelectStore>(set => ({
    rentSelectedItem: '',
    setRentSelectedItem: (rentSelectedItem: string) => set(state => ({ ...state, rentSelectedItem }))
}));

export default useRentSelectStore;
