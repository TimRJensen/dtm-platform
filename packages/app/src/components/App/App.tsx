/**
 * Vendor imports.
 */
import * as React from "react";

/**
 * Custom imports.
 */
import { PouchDB, PouchDBProvider } from "db";
import { HelloWorld } from "../HelloWorld/HelloWorld";
import { Post } from "../Post/Post";

/**
 * App functional component.
 */
interface Props {
  db: PouchDB;
}

export const App = function (props: Props) {
  return (
    <PouchDBProvider value={props.db}>
      <HelloWorld msg={"Ave Terra!"} />
      <Post id={"blog:9"} />
    </PouchDBProvider>
  );
};
