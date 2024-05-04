import { create } from "zustand";

type MFASecret = {
  secret: object;

  add: (secret: object) => void;
  delete: () => void;
};

const useSecretStore = create<MFASecret>((set) => ({
  secret: {},

  add: (secret: object): void => set(() => ({ secret: secret })),

  delete: (): void => set(() => ({ secret: {} })),
}));

export default useSecretStore;
