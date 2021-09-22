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
