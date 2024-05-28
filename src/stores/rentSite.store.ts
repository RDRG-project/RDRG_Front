import { create } from "zustand";

interface RentSiteStore {
    rentSite: string;
    setRentSite: (rentSite: string) => void;
}

const useRentSiteStore = create<RentSiteStore>((set => ({
    rentSite: '',
    setRentSite: (rentSite: string) => set(state => ({ ...state, rentSite }))
})))

export default useRentSiteStore;