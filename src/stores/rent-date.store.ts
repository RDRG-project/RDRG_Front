import { create } from "zustand";

interface RentDateStore {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (startDate: Date | null) => void;
    setEndDate: (endDate: Date | null) => void;
}

const useStore = create<RentDateStore>((set => ({
    startDate: new Date,
    endDate: new Date,
    setStartDate: (startDate: Date | null) => set(state => ({ ...state, startDate })),
    setEndDate: (endDate: Date | null) => set(state => ({ ...state, endDate })),
})));

export default useStore;