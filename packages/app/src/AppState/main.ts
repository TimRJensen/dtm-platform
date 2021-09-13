/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { AllDocuments, GetDocument } from "db";

/**
 * Types.
 */
export interface AppState {
  user?: GetDocument<AllDocuments, "user">;
  currentBlog?: GetDocument<AllDocuments, "blog">;
  showEditor?: (flag: boolean) => void;
}

export type Actions =
  | {
      type: "setUser";
      value: GetDocument<AllDocuments, "user"> | undefined;
    }
  | {
      type: "setCurrentBlog";
      value: GetDocument<AllDocuments, "blog"> | undefined;
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
