/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { Switch, Link, Route, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import FontIcon from "../../components/FontIcon/FontIcon";
import Button from "../../components/Button/Button";
import GoogleLogo from "../../public/google-logo.svg";
import FacebookLogo from "../../public/facebook-logo.svg";

/**
 * Types.
 */
const path = "/login/:loginId";

interface Props {}

/**
 * login functional component.
 */
export default function login({}: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    login: {},
    group: {
      width: "inherit",
      display: "flex",
      flexFlow: "column",
      alignItems: "center",
      margin: `${spacing * 2}px 0 ${spacing * 2}px 0`,
    },
    label: {
      textAlign: "center",
      margin: `0 0 ${spacing}px 0`,
    },
    button: {
      display: "flex",
      alignItems: "center",
      height: 58,
      width: 235,
      margin: `0 0 ${spacing}px 0`,
      padding: `0 0 0 ${7 / 2}px`,
    },
    logo: {
      margin: `0 ${spacing}px 0 0`,
      backgroundColor: "#FFF",
      borderRadius: "50%",
    },
    fontIcon: {
      height: 48,
      width: 48,
      margin: `0 ${spacing}px 0 0`,
      backgroundColor: "#FFF",
      borderRadius: "50%",
    },
    magicLink: {
      color: "#6851FF",
    },
    artiFACT: {
      color: colors.secondary,
    },
    link: {
      color: colors.text.link,
    },
  }));
  const { dispatch } = useContext(AppStateContext);

  useEffect(() => {
    dispatch({ type: "CURRENT_PATH", value: { section: "login", label: "" } });
  }, []);

  return (
    <section css={css.login}>
      <Switch>
        <Route
          path="/login"
          exact
          render={() => (
            <section>
              <div css={css.group}>
                <div css={css.label}>Login with an existing login:</div>
                <Link
                  to={generatePath(path, {
                    loginId: "google",
                  })}
                >
                  <Button $css={{ ...css }}>
                    <GoogleLogo css={css.logo} />
                    Login with Google
                  </Button>
                </Link>
                <Link
                  to={generatePath(path, {
                    loginId: "facebook",
                  })}
                >
                  <Button $css={{ ...css }}>
                    <FacebookLogo css={css.logo} />
                    Login with Facebook
                  </Button>
                </Link>
                <Link
                  to={generatePath(path, {
                    loginId: "magiclink",
                  })}
                >
                  <Button $css={{ ...css }}>
                    <FontIcon
                      $css={{ ...css, icon: css.magicLink }}
                      type="auto_fix_high"
                      size={38}
                    />
                    Login with magiclink
                  </Button>
                </Link>
                <Link
                  to={generatePath(path, {
                    loginId: "ArtiFACT",
                  })}
                >
                  <Button $css={{ ...css }}>
                    <FontIcon
                      $css={{ ...css, icon: css.artiFACT }}
                      type="account_circle"
                      size={48}
                    />
                    Login with ArtiFACT
                  </Button>
                </Link>
                <br />
                <div>
                  Don't have an account yet? Create one{" "}
                  <Link css={css.link} to="/account/new">
                    here
                  </Link>
                  .
                </div>
              </div>
            </section>
          )}
        />
      </Switch>
    </section>
  );
}
