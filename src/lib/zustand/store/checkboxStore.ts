import { create } from "zustand";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";

type CheckBoxStore = {
  checkbox: boolean;
  mfaEnabled: () => void;
  toggleCheckBox: (value: boolean) => void;
};

export const useCheckBoxStore = create<CheckBoxStore>((set) => ({
  checkbox: false,
  mfaEnabled: async () => {
    const user: User = await FetchUser();
    set({ checkbox: user?.mfaEnabled });
  },
  toggleCheckBox: (value: boolean) => set(() => ({ checkbox: value })),
}));
