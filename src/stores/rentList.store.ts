import { DeviceListItem } from "src/types";
import { create } from "zustand";

interface rentListStore {
    selectListItItem: boolean;
    setSelectListItItem: (selectListItItem: boolean) => void;
    rentStatus: string;
    setRentStatus: (rentStatus: string) => void;
    rentViewList: DeviceListItem[];
    setRentViewList: (rentViewList: DeviceListItem[]) => void;
}

const useRentListStore = create<rentListStore>(set => ({
    selectListItItem: false,
    setSelectListItItem: (selectListItItem: boolean) => set(state => ({ ...state, selectListItItem })),

    rentStatus: '',
    setRentStatus: (rentStatus: string) => set(state => ({ ...state, rentStatus })),
    rentViewList: [],
    setRentViewList: (rentViewList: DeviceListItem[]) => set(state => ({ ...state, rentViewList }))
}));


export default useRentListStore;
