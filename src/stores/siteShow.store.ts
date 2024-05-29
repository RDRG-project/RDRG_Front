import { create } from "zustand";

interface siteShowStore {
    show: boolean;
    setShow: (rentStatus: boolean) => void;
}

const useSiteShowStore = create<siteShowStore>(set => ({
    show: false,
    setShow: (show: boolean) => set(state => ({ ...state, show }))
}));

export default useSiteShowStore;