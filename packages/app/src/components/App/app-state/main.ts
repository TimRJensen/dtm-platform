/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { UserDocument, BlogDocument } from "db";

/**
 * Types.
 */
export interface AppState {
  user: UserDocument | undefined;
  currentBlog: BlogDocument | undefined;
  showEditor: ((flag: boolean) => void) | undefined;
}

export type Actions =
  | {
      type: "setUser";
      value: UserDocument | undefined;
    }
  | {
      type: "setCurrentBlog";
      value: BlogDocument | undefined;
    }
  | {
      type: "showEditor";
      value: ((flag: boolean) => void) | undefined;
    };

/**
 * appstate
 */
export const reducer = function reducer(state: AppState, action: Actions) {
  switch (action.type) {
    case "setCurrentBlog":
      return { ...state, currentBlog: action.value };
    case "showEditor":
      return { ...state, showEditor: action.value };
    default:
      throw new Error();
  }
};

export { AppStateProvider } from "./context";
export { AppStateContext } from "./context";
