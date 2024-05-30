import { create } from "zustand";

interface returnSiteShowStore {
    returnShow: boolean;
    setReturnShow: (returnShow: boolean) => void;
}

const useReturnSiteShowStore = create<returnSiteShowStore>(set => ({
    returnShow: false,
    setReturnShow: (returnShow: boolean) => set(state => ({ ...state, returnShow }))
}));

export default useReturnSiteShowStore;