import { create } from "zustand";

interface UserStore {
    loginUserId: string,
    loginUserRole: string,
    setLoginUserId: (loginUserId: string) => void,
    setLoginUserRole: (loginUserRole: string) => void,
    logoutUser: () => void
}

const useUserStore = create<UserStore>(set => ({
    loginUserId: '',
    loginUserRole: '',
    setLoginUserId: (loginUserId: string) => set(state => ({ ...state, loginUserId })),
    setLoginUserRole: (loginUserRole: string) => set(state => ({ ...state, loginUserRole })),
    logoutUser: () => set (state => ({ ...state, loginUserId: '', loginUserRole: '' })),
}));

export default useUserStore;

