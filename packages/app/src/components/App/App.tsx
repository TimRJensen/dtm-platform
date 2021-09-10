/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDB, PouchDBProvider } from "db";
import { Blog } from "../Blog/Blog";
import { HomeView } from "../HomeView/HomeView";

/**
 * App functional component.
 */
interface Props {
  db: PouchDB;
}

export const App = function (props: Props) {
  return (
    <PouchDBProvider value={props.db}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomeView} />
          <Route path="/blogs/:key" component={Blog} />
        </Switch>
      </Router>
    </PouchDBProvider>
  );
};
