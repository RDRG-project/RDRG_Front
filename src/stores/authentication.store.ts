import { create } from 'zustand';


interface AuthenticationStore {
    authPage: 'sign-in' | 'sign-up',
    setAuthPage: (authPage: 'sign-in' | 'sign-up') => void,
}

const useAuthenticationStore = create<AuthenticationStore>(set => ({
    authPage: 'sign-in',
    setAuthPage: (authPage: 'sign-in' | 'sign-up') => set(state => ({ ...state, authPage })),
}));
export default useAuthenticationStore;