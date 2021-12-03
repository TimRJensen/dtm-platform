/**
 * Vendor imports.
 */
import { useReducer, Reducer, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider, css, Global } from "@emotion/react";

/**
 * Custom imports.
 */
import DB, { DBProvider, UserType } from "db";
import theme from "../../themes/dtm";
import AppHeader from "../AppHeader/AppHeader";
import AppNavbar from "../AppNavbar/AppNavbar";
import Test from "../Test";
import { Actions, AppState, AppStateProvider, reducer } from "./app-state/main";

const _Index = lazy(() => import("../../pages"));
const _Blog = lazy(() => import("../../pages/blogs/"));
const _Search = lazy(() => import("../../pages/search"));
const _Login = lazy(() => import("../../pages/login"));
const _Account = lazy(() => import("../../pages/account"));

/**
 * Css.
 */
const _css = css({
  ":root": {
    fontFamily: `"Roboto", sans-serif`,
    boxSizing: "border-box",
  },
  "*": {
    boxSizing: "inherit",
    "&::-webkit-scrollbar": {
      width: "0.5rem",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.colors.primary,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.secondary,
    },
    "&::after, &::before": {
      boxSizing: "inherit",
    },
  },
  body: {
    margin: 0,
  },
  a: {
    outline: "none",
    color: theme.colors.text.link,
    textDecoration: "none",
  },
  button: {
    border: "none",
    backgroundColor: "#FFF",
    fontFamily: "inherit",
    fontSize: "0.8rem",
  },
  input: {
    outline: "none",
    border: "none",
    fontFamily: "inherit",
    fontSize: "0.8rem",
  },
});

/**
 * App functional component.
 */
interface Props {
  db: DB;
}

export default function App({ db }: Props) {
  const [state, dispatch] = useReducer<Reducer<AppState, Actions>>(reducer, {
    currentUser: undefined,
    currentBlog: undefined,
    currentPath: undefined,
    showEditor: undefined,
  });

  const fetch = async (user: any) => {
    const response = await db.selectExact<UserType>(
      "app_users",
      `
        id,
        role,
        email,
        displayName,
        stats
    `,
      {
        match: { email: user?.email ?? "" },
      }
    );

    if ("error" in response) {
      return;
    }
    console.log("account fetched", user, response);

    dispatch({ type: "CURRENT_USER", value: response });
  };

  useEffect(() => {
    db.onAuthChange((event, session) => {
      console.log("user state change", event, session);

      switch (event) {
        case "SIGNED_IN": {
          fetch(session!.user);

          break;
        }

        case "SIGNED_OUT": {
          dispatch({ type: "CURRENT_USER", value: undefined });

          break;
        }
      }
    });

    const user = db.currentUser();
    if (user) {
      fetch(user);
    }
  }, []);

  return (
    <DBProvider value={db}>
      <AppStateProvider value={{ state, dispatch }}>
        <ThemeProvider theme={theme}>
          <Router basename="/">
            <Global styles={_css} />
            <AppHeader />
            <AppNavbar />
            <Switch>
              <Route
                exact
                path="/blogs/:blogId"
                render={() => (
                  <Suspense fallback={<div />}>
                    <_Blog blog={state.currentBlog} />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/search/:query/:pageId?"
                render={() => (
                  <Suspense fallback={<div />}>
                    <_Search />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/login/:loginId?"
                render={() => (
                  <Suspense fallback={<div />}>
                    <_Login />
                  </Suspense>
                )}
              />
              <Route
                exact
                path="/account/:newOrExisting?/:errorOrSucces?"
                render={() => (
                  <Suspense fallback={<div />}>
                    <_Account />
                  </Suspense>
                )}
              />
              <Route path="/test" render={() => <Test />} />
              <Route
                path="/"
                render={() => (
                  <Suspense fallback={<div />}>
                    <_Index />
                  </Suspense>
                )}
              />
            </Switch>
          </Router>
        </ThemeProvider>
      </AppStateProvider>
    </DBProvider>
  );
}
