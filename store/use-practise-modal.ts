import { create } from "zustand"

type PractiseModalState = {
    isOpen:boolean;
    open : () => void;
    close: () => void;
}

export const usePractiseModal = create <PractiseModalState>((set) => ({
    isOpen: false, //Change back to false
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false})
}))