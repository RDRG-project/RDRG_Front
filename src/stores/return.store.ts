import { create } from "zustand";

interface ReturnStore {
    returnSite: string;
    setReturnSite: (rentSite: string) => void;
    returnSelectedItem: string;
    setReturnSelectedItem: (returnSelectedItem: string) => void;
    returnShow: boolean;
    setReturnShow: (returnShow: boolean) => void;
}

const useReturnStore = create<ReturnStore>((set => ({
    returnSite: '',
    setReturnSite: (returnSite: string) => set(state => ({ ...state, returnSite })),
    returnSelectedItem: '',
    setReturnSelectedItem: (returnSelectedItem: string) => set(state => ({ ...state, returnSelectedItem })),
    returnShow: false,
    setReturnShow: (returnShow: boolean) => set(state => ({ ...state, returnShow }))
})))

export default useReturnStore;