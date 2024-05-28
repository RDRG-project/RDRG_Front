import { create } from "zustand";

interface ReturnSiteStore {
    returnSite: string;
    setReturnSite: (rentSite: string) => void;
}

const useReturnSiteStore = create<ReturnSiteStore>((set => ({
    returnSite: '',
    setReturnSite: (returnSite: string) => set(state => ({ ...state, returnSite }))
})))

export default useReturnSiteStore;