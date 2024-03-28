import { createContext, Dispatch, SetStateAction } from "react";

export const SessionContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(["", () => ""]);
