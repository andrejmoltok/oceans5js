import { create } from "zustand";

type MFASecret = {
  secret: object;

  add: (secret: object) => void;
  delete: () => void;
};

const useSecretStore = create<MFASecret>()((set) => ({
  secret: {},

  add: () =>
    set((state) => {
      secret: state.secret;
    }),

  delete: () => set(() => ({ secret: {} })),
}));

export default useSecretStore;
