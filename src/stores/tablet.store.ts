import { create } from "zustand";

interface tabletStateStore {
    tabletState: boolean;
    setTabletState: (tabletState: boolean) => void;
}

const useTabletStore = create<tabletStateStore>(set => ({
    tabletState: false,
    setTabletState: (tabletState: boolean) => set(state => ({ ...state, tabletState }))
}));

export default useTabletStore;