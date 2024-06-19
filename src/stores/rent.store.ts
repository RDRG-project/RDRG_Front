import { create } from "zustand";

interface RentStore {
    rentSite: string;
    rentSelectedItem: string;
    rentShow: boolean;
    setRentSite: (rentSite: string) => void;
    setRentSelectedItem: (rentSelectedItem: string) => void;
    setRentShow: (rentShow: boolean) => void;
}

const useRentStore = create<RentStore>((set => ({
    rentSite: '',
    rentSelectedItem: '',
    rentShow: false,
    setRentSite: (rentSite: string) => set(state => ({ ...state, rentSite })),
    setRentSelectedItem: (rentSelectedItem: string) => set(state => ({ ...state, rentSelectedItem })),
    setRentShow: (rentShow: boolean) => set(state => ({ ...state, rentShow }))
})));

export default useRentStore;
