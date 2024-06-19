import { create } from "zustand";

interface ReturnStore {
    returnSite: string;
    returnSelectedItem: string;
    returnShow: boolean;
    setReturnSite: (rentSite: string) => void;
    setReturnSelectedItem: (returnSelectedItem: string) => void;
    setReturnShow: (returnShow: boolean) => void;
}

const useReturnStore = create<ReturnStore>((set => ({
    returnSite: '',
    returnSelectedItem: '',
    returnShow: false,
    setReturnSite: (returnSite: string) => set(state => ({ ...state, returnSite })),
    setReturnSelectedItem: (returnSelectedItem: string) => set(state => ({ ...state, returnSelectedItem })),
    setReturnShow: (returnShow: boolean) => set(state => ({ ...state, returnShow }))
})));

export default useReturnStore;