/**
 * Vendor imports.
 */
import { useReducer, Reducer, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider, css, Global } from "@emotion/react";

/**
 * Custom imports.
 */
import { DB, DBProvider, UserType, Session, AuthChangeEvent } from "db";
import theme from "../../themes/dtm";
import { Header } from "./Header/Header";
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
  a: {
    textDecoration: "none",
  },
});

/**
 * App functional component.
 */
interface Props {
  db: DB;
}

export function App({ db }: Props) {
  const [state, dispatch] = useReducer<Reducer<AppState, Actions>>(reducer, {
    currentUser: undefined,
    currentBlog: undefined,
    currentPath: undefined,
    showEditor: undefined,
  });

  const handleAuthChange = async (
    event: AuthChangeEvent,
    session: Session | null
  ) => {
    console.log(event, session);

    if (!session) {
      return;
    }

    const { user } = session;

    switch (event) {
      case "SIGNED_IN": {
        const response = await db.selectExact<UserType>(
          "accounts",
          `
            id,
            role,
            email,
            displayName,
            verified,
            stats
        `,
          {
            match: { email: user?.email ?? "" },
          }
        );

        console.log("app", response);
        if ("error" in response) {
          break;
        }

        dispatch({ type: "CURRENT_USER", value: response });
        break;
      }
    }
  };

  useEffect(() => {
    db.onAuthChange(handleAuthChange);

    console.log("dbUser", db.currentUser());
  }, []);

  return (
    <DBProvider value={db}>
      <AppStateProvider value={{ state, dispatch }}>
        <ThemeProvider theme={theme}>
          <Router basename="/">
            <Global styles={_css} />
            <Header />
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
