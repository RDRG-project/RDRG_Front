import { create } from "zustand";

interface rentSiteShowStore {
    rentShow: boolean;
    setRentShow: (rentShow: boolean) => void;
}

const useRentSiteShowStore = create<rentSiteShowStore>(set => ({
    rentShow: false,
    setRentShow: (rentShow: boolean) => set(state => ({ ...state, rentShow }))
}));

export default useRentSiteShowStore;