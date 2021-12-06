/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { UserType, BlogType } from "db";

/**
 * Types.
 */
export interface AppState {
  currentUser: UserType | undefined;
  currentBlog: BlogType | undefined;
  currentPath: { section: string; label?: string } | undefined;
  error: { message: string; code: number } | undefined;
  showEditor: ((flag: boolean) => void) | undefined;
}

export type Actions =
  | {
      type: "CURRENT_USER";
      value: UserType | undefined;
    }
  | {
      type: "CURRENT_BLOG";
      value: BlogType | undefined;
    }
  | {
      type: "CURRENT_PATH";
      value: { section: string; label?: string };
    }
  | {
      type: "SHOW_EDITOR";
      value: ((flag: boolean) => void) | undefined;
    }
  | {
      type: "SET_ERROR";
      value: { message: string; code: number } | undefined;
    }
  | {
      type: "ANY";
      value: Partial<AppState>;
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
    case "CURRENT_PATH":
      return {
        ...state,
        currentPath: { ...state.currentPath, ...action.value },
      };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "SHOW_EDITOR":
      return { ...state, showEditor: action.value };
    case "ANY":
      return { ...state, ...action.value };
    default:
      throw new Error();
  }
};

export { AppStateProvider } from "./context";
export { AppStateContext } from "./context";
