import { createContext, useContext } from "react";

export const FormContext = createContext();

export function useFormContext() {
  const context = useContext(FormContext);
  return context;
}
