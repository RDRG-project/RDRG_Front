import { create } from "zustand";
import { differenceInDays, differenceInHours } from 'date-fns';

interface RentDateStore {
    startDate: Date | null;
    endDate: Date | null;
    totalRentTime: string | null;
    setStartDate: (startDate: Date | null) => void;
    setEndDate: (endDate: Date | null) => void;
}

const useRentDateStore = create<RentDateStore>((set, get) => ({
    startDate: new Date(),
    endDate: new Date(),
    totalRentTime: null,
    setStartDate: (startDate: Date | null) => {
        set(state => ({ ...state, startDate }));
        const { endDate } = get();
        if (startDate && endDate) {
            const days = differenceInDays(endDate, startDate);
            const hours = differenceInHours(endDate, startDate) % 24;
            set({ totalRentTime: `${days}일 ${hours}시간` });
        } else {
            set({ totalRentTime: null });
        }
    },
    setEndDate: (endDate: Date | null) => {
        set(state => ({ ...state, endDate }));
        const { startDate } = get();
        if (startDate && endDate) {
            const days = differenceInDays(endDate, startDate);
            const hours = differenceInHours(endDate, startDate) % 24;
            set({ totalRentTime: `${days}일 ${hours}시간` });
        } else {
            set({ totalRentTime: null });
        }
    }
}));

export default useRentDateStore;