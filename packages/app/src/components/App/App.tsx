/**
 * Vendor imports.
 */
import { useReducer, Reducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDB, PouchDBProvider } from "db";
import { Actions, AppState, AppStateProvider, reducer } from "./app-state/main";
import { Blog } from "../Blog/Blog";
import { HomeView } from "../HomeView/HomeView";
import { NavBar } from "../NavBar/NavBar";
import "./style.scss";

/**
 * App functional component.
 */
interface Props {
  db: PouchDB;
}

export const App = function ({ db }: Props) {
  const [state, dispatch] = useReducer<Reducer<AppState, Actions>>(reducer, {
    currentUser: db.createDoc("user", "/users/john.doe@gmail.com", {
      name: "Arthur Fonzarelli",
      email: "the_fonz@gmail.com",
      stats: {
        infractions: 0,
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        threads: 0,
      },
    }),
    currentBlog: undefined,
    currentQuery: undefined,
    showEditor: undefined,
  });

  return (
    <PouchDBProvider value={db}>
      <AppStateProvider value={{ state, dispatch }}>
        <Router>
          <NavBar />
          <div style={{ marginTop: "40px" }}>
            <Switch>
              <Route exact path="/" component={HomeView} />
              <Route exact path="/blogs/:blogId" component={Blog} />
            </Switch>
          </div>
        </Router>
      </AppStateProvider>
    </PouchDBProvider>
  );
};
