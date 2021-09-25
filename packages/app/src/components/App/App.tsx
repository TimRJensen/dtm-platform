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
import { AppHeader } from "../AppHeader/AppHeader";
import { Blog } from "../Blog/Blog";
import { HomeView } from "../HomeView/HomeView";
import { SearchView } from "../SearchView/SearchView";
import "./style.scss";

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
      name: "Arthur Fonzarelli",
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
          <AppHeader />
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route
              path="/blogs/:blogId/:threadId?/:postId?/:commentId?"
              render={() => {
                return <Blog blog={state.currentBlog} />;
              }}
            />
            <Route
              path="/search/:query/:pageId?"
              render={() => {
                return <SearchView />;
              }}
            />
          </Switch>
        </Router>
      </AppStateProvider>
    </PouchDBProvider>
  );
};
