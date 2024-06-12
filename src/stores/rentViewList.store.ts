import { DeviceListItem } from "src/types";
import { create } from "zustand";

interface RentViewStore {
    rentViewList: DeviceListItem[];
    setRentViewList: (rentViewList: DeviceListItem[]) => void;
}

const useRentViewStore = create<RentViewStore>((set => ({
    rentViewList: [],
    setRentViewList: (rentViewList: DeviceListItem[]) => set(state => ({ ...state, rentViewList }))
})))

export default useRentViewStore;