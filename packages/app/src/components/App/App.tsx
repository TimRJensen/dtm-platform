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
import { default as Index } from "../../pages/index";
import { BlogView } from "../BlogView/BlogView";
import { SearchView } from "../SearchView/SearchView";
import { Test } from "../Test/Test";
import "./styles.scss";

/**
 * App functional component.
 */
interface Props {
  db: PouchDB;
}

export const App = function ({ db }: Props) {
  const [state, dispatch] = useReducer<Reducer<AppState, Actions>>(reducer, {
    currentUser: {
      type: "user",
      _id: "users/test-user",
      role: "user",
      displayName: "Arthur Fonzarelli",
      email: "arthur.fonzarelli@gmail.com",
      stats: {
        upvotes: 0,
        downvotes: 0,
        infractions: 0,
        comments: 0,
        threads: 0,
      },
      timestamp: Date.now(),
      lastModified: Date.now(),
    },
    currentBlog: undefined,
    currentQuery: undefined,
    showEditor: undefined,
  });

  return (
    <PouchDBProvider value={db}>
      <AppStateProvider value={{ state, dispatch }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route
              path="/blogs/:blogId/:threadId?/:postId?/:commentId?"
              render={() => {
                return <BlogView blog={state.currentBlog} />;
              }}
            />
            <Route
              path="/search/:query/:pageId?"
              render={() => {
                return <SearchView />;
              }}
            />
            <Route path="/test" component={Test} />
          </Switch>
        </Router>
      </AppStateProvider>
    </PouchDBProvider>
  );
};
