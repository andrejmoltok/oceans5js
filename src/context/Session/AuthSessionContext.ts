import { createContext, Dispatch, SetStateAction } from "react";

export const AuthSessionContext = createContext<
  [
    string,
    Dispatch<SetStateAction<string>>,
    boolean,
    Dispatch<SetStateAction<boolean>>
  ]
>(["", () => "", false, () => false]);
