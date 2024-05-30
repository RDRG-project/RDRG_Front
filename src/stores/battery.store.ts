import { create } from "zustand";

interface batteryStateStore {
    externalBatteryState: boolean;
    setExternalBatteryState: (externalBatteryState: boolean) => void;
}

const useBatteryStore = create<batteryStateStore>(set => ({
    externalBatteryState: false,
    setExternalBatteryState: (externalBatteryState: boolean) => set(state => ({ ...state, externalBatteryState }))
}));

export default useBatteryStore;