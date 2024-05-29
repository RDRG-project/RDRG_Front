import { create } from "zustand";

interface rentListStore {
    selectListItItem: boolean;
    setSelectListItItem: (selectListItItem: boolean) => void;
}

const useRentListStore = create<rentListStore>(set => ({
    selectListItItem: false,
    setSelectListItItem: (selectListItItem: boolean) => set(state => ({ ...state, selectListItItem }))
}));

export default useRentListStore;

