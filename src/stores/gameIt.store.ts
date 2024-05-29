import { create } from "zustand";

interface gameItStateStore {
    gameItState: boolean;
    setGameItState: (gameItState: boolean) => void;
}

const useGameItStore = create<gameItStateStore>(set => ({
    gameItState: false,
    setGameItState: (gameItState: boolean) => set(state => ({ ...state, gameItState }))
}));

export default useGameItStore;