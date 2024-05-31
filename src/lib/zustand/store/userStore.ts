import { create } from "zustand";
import FetchUser from "@/actions/user/fetchUser";
import { User } from "@/actions/user/user";

type UserStore = {
  user: User | null;
  needRefetch: boolean;
  fetchUserData: () => Promise<void>;
  setNeedRefetch: (value: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  needRefetch: false,
  fetchUserData: async () => {
    const user = await FetchUser();
    set({ user, needRefetch: false });
  },
  setNeedRefetch: (value: boolean) => set({ needRefetch: value }),
}));
