import { createContext, Dispatch, SetStateAction } from "react";

export const AuthContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => false]);
