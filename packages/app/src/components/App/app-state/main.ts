/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { UserDocument, BlogDocument, PostDocument, CommentDocument } from "db";

/**
 * Types.
 */
export interface AppState {
  currentUser: UserDocument | undefined;
  currentBlog: BlogDocument | undefined;
  currentQuery: string[] | undefined;
  showEditor: ((flag: boolean) => void) | undefined;
}

export type Actions =
  | {
      type: "CURRENT_USER";
      value: UserDocument | undefined;
    }
  | {
      type: "CURRENT_BLOG";
      value: BlogDocument | undefined;
    }
  | {
      type: "CURRENT_QUERY";
      value: string[] | undefined;
    }
  | {
      type: "SHOW_EDITOR";
      value: ((flag: boolean) => void) | undefined;
    };

/**
 * appstate
 */
export const reducer = function reducer(state: AppState, action: Actions) {
  switch (action.type) {
    case "CURRENT_BLOG":
      return { ...state, currentBlog: action.value };
    case "CURRENT_USER":
      return { ...state, currentUser: action.value };
    case "CURRENT_QUERY":
      return { ...state, currentQuery: action.value };
    case "SHOW_EDITOR":
      return { ...state, showEditor: action.value };
    default:
      throw new Error();
  }
};

export { AppStateProvider } from "./context";
export { AppStateContext } from "./context";
