import { create } from "zustand";

interface noteBookStateStore {
    notebookState: boolean;
    setNotebookState: (notebookState: boolean) => void;
}

const useNoteBookStore = create<noteBookStateStore>(set => ({
    notebookState: false,
    setNotebookState: (notebookState: boolean) => set(state => ({ ...state, notebookState }))
}));

export default useNoteBookStore;