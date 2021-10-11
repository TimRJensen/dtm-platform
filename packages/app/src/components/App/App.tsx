/**
 * Vendor imports.
 */
import { useReducer, Reducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider, css, Global } from "@emotion/react";

/**
 * Custom imports.
 */
import { PouchDB, PouchDBProvider } from "db";
import theme from "../../themes/dtm";
import { default as Index } from "../../pages/index";
import { default as Blog } from "../../pages/blogs/blog";
import { default as Search } from "../../pages/search/search";
import { Test } from "../Test/Test";
import { Actions, AppState, AppStateProvider, reducer } from "./app-state/main";

/**
 * Css.
 */
const _css = css({
  ":root": {
    fontFamily: `"Roboto", sans-serif`,
    boxSizing: "border-box",
  },
  body: {
    margin: 0,
    "&::-webkit-scrollbar": {
      width: "0.5rem",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.colors.primary,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.secondary,
    },
  },
});

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
        <ThemeProvider theme={theme}>
          <Router>
            <Global styles={_css} />
            <Switch>
              <Route exact path="/" component={Index} />
              <Route
                path="/blogs/:blogId/:threadId?/:postId?/:commentId?"
                render={() => {
                  return <Blog blog={state.currentBlog} />;
                }}
              />
              <Route
                path="/search/:query/:pageId?"
                render={() => {
                  return <Search />;
                }}
              />
              <Route path="/test" component={Test} />
            </Switch>
          </Router>
        </ThemeProvider>
      </AppStateProvider>
    </PouchDBProvider>
  );
};
