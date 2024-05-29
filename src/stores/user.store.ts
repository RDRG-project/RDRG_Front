import { create } from "zustand";

interface UserStore {
    loginUserId: string,
    setLoginUserId: (loginUserId: string) => void,
    loginUserRole: string,
    setLoginUserRole: (loginUserRole: string) => void,
    logoutUser: () => void
}

const useUserStore = create<UserStore>(set => ({
    loginUserId: '',
    setLoginUserId: (loginUserId: string) => set(state => ({ ...state, loginUserId })),
    loginUserRole: '',
    setLoginUserRole: (loginUserRole: string) => set(state => ({ ...state, loginUserRole })),
    logoutUser: () => set (state => ({ ...state, loginUserId: '', loginUserRole: '' })),
}));

export default useUserStore;

