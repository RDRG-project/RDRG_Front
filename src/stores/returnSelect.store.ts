import { create } from "zustand";

interface ReturnSelectStore {
    returnSelectedItem: string;
    setReturnSelectedItem: (returnSelectedItem: string) => void;
}

const useReturnSelectStore = create<ReturnSelectStore>(set => ({
    returnSelectedItem: '',
    setReturnSelectedItem: (returnSelectedItem: string) => set(state => ({ ...state, returnSelectedItem }))
}));

export default useReturnSelectStore;