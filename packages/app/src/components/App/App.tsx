/**
 * Vendor imports.
 */
import { useReducer, Reducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDB, PouchDBProvider } from "db";
import {
  Actions,
  AppState,
  AppStateProvider,
  reducer,
} from "../../AppState/main";
import { Blog } from "../Blog/Blog";
import { HomeView } from "../HomeView/HomeView";

/**
 * App functional component.
 */
interface Props {
  db: PouchDB;
}

export const App = function (props: Props) {
  const [state, dispatch] = useReducer<Reducer<AppState, Actions>>(reducer, {
    user: undefined,
    currentBlog: undefined,
    showEditor: undefined,
  });

  return (
    <PouchDBProvider value={props.db}>
      <AppStateProvider value={{ state, dispatch }}>
        <Router>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/blogs/:blogId" component={Blog} />
          </Switch>
        </Router>
      </AppStateProvider>
    </PouchDBProvider>
  );
};
