import { create } from "zustand";

interface RentStore {
    rentSite: string;
    setRentSite: (rentSite: string) => void;
    rentSelectedItem: string;
    setRentSelectedItem: (rentSelectedItem: string) => void;
    rentShow: boolean;
    setRentShow: (rentShow: boolean) => void;
}

const useRentStore = create<RentStore>((set => ({
    rentSite: '',
    setRentSite: (rentSite: string) => set(state => ({ ...state, rentSite })),
    rentSelectedItem: '',
    setRentSelectedItem: (rentSelectedItem: string) => set(state => ({ ...state, rentSelectedItem })),
    rentShow: false,
    setRentShow: (rentShow: boolean) => set(state => ({ ...state, rentShow }))
})))

export default useRentStore;
