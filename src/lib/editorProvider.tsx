import { createContext } from "react";

export const EditorContext = createContext({});

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  return <EditorContext.Provider value={{}}>{children}</EditorContext.Provider>;
};
