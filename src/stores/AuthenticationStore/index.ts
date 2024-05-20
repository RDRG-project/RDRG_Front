import { create } from 'zustand';


interface AuthenticationStore {
    signIn: string,
    setSignIn: (signIn: string) => void,
    signUp: string,
    setSignUp: (signUp: string) => void,
}

const useAuthenticationStore = create<AuthenticationStore>(set => ({
    signIn: '',
    setSignIn: (signIn: string) => set(state => ({ ...state, signIn })),
    signUp: '',
    setSignUp: (signUp: string) => set(state => ({ ...state, signUp }))
}));

export default useAuthenticationStore;