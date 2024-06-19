import { create } from 'zustand';
import { differenceInDays } from 'date-fns';
interface RentDateStore {
    startDate: Date | null;
    endDate: Date | null;
    totalRentTime: string | null;
    totalAmount: number;
    setTotalAmount: (amount: number) => void;
    setStartDate: (startDate: Date | null) => void;
    setEndDate: (endDate: Date | null) => void;
    calculateTotalRentTime: () => void;
}

const useRentDateStore = create<RentDateStore>((set, get) => ({
    startDate: new Date(),
    endDate: new Date(),
    totalRentTime: null,
    setStartDate: (startDate: Date | null) => {
        set(state => ({ ...state, startDate }));
        get().calculateTotalRentTime();
    },
    setEndDate: (endDate: Date | null) => {
        set(state => ({ ...state, endDate }));
        get().calculateTotalRentTime();
    },
    calculateTotalRentTime: () => {
        const { startDate, endDate } = get();
        if (startDate && endDate && endDate > startDate) {
            const days = differenceInDays(endDate, startDate);
            set({ totalRentTime: `${days}일` });
        } else {
            set({ totalRentTime: null });
        }
    },
    totalAmount: 0,
    setTotalAmount: (amount) => set({ totalAmount: amount }),
}));

export default useRentDateStore;
