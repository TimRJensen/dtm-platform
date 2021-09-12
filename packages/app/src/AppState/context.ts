/**
 * Vendor imports.
 */
import { createContext, Dispatch } from "react";

/**
 * Custom imports.
 */
import { AppState, Actions } from "./main";

/**
 * PouchDB context.
 */
export const AppStateContext = createContext(
  {} as { state: AppState; dispatch: Dispatch<Actions> }
);
export const AppStateProvider = AppStateContext.Provider;
