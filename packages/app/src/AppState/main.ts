/**
 * Vendor imports.
 */

import { BlogDocument, GetDocument } from "db";

/**
 * Custom imports.
 */

/**
 * Types.
 */
export interface AppState {
  currentBlog: GetDocument<BlogDocument>;
}

export type Actions =
  | { type: "setCurrentBlog"; value: GetDocument<BlogDocument> }
  | { type: "test"; value: number };

type ExtractActionParameters<A> = A extends { type: Actions["type"] }
  ? A
  : never;

type Test = ExtractActionParameters<Actions>;

/**
 * appstate
 */
export const reducer = function reducer(
  state: AppState,
  action: ExtractActionParameters<Actions>
) {
  switch (action.type) {
    case "setCurrentBlog":
      return { currentBlog: action.value };
    default:
      throw new Error();
  }
};

export { AppStateProvider } from "./context";
export { AppStateContext } from "./context";
