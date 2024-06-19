import { create } from "zustand";
import { DeviceListItem } from "src/types";

interface rentListStore {
    selectListItItem: boolean;
    rentStatus: string;
    rentViewList: DeviceListItem[];
    setSelectListItItem: (selectListItItem: boolean) => void;
    setRentStatus: (rentStatus: string) => void;
    setRentViewList: (rentViewList: DeviceListItem[]) => void;
}

const useRentListStore = create<rentListStore>(set => ({
    selectListItItem: false,
    rentStatus: '',
    rentViewList: [],
    setSelectListItItem: (selectListItItem: boolean) => set(state => ({ ...state, selectListItItem })),
    setRentStatus: (rentStatus: string) => set(state => ({ ...state, rentStatus })),
    setRentViewList: (rentViewList: DeviceListItem[]) => set(state => ({ ...state, rentViewList }))
}));

export default useRentListStore;
