import { create } from "zustand";

interface TotalRentTimeStore {
    totalRentTime: string | null;
    setTotalRentTime: (totalRentTime: string | null) => void;
}

const useTotalRentTimeStore = create<TotalRentTimeStore>((set => ({
    totalRentTime: '',
    setTotalRentTime: (totalRentTime: string | null) => set(state => ({ ...state, totalRentTime }))
})))

export default useTotalRentTimeStore;