/**
 * Vendor imports.
 */
import { createContext, Dispatch } from "react";

/**
 * Custom imports.
 */
import { AppState, Actions } from "./main";

/**
 * AppState context.
 */
export const AppStateContext = createContext(
  {} as { state: AppState; dispatch: Dispatch<Actions> }
);
export const AppStateProvider = AppStateContext.Provider;
