/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { Link, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS, useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/main";
import FontIcon from "../../components/FontIcon/FontIcon";
import Button from "../../components/Button/Button";
//import GoogleLogo from "../../public/google-logo.svg";
//import FacebookLogo from "../../public/facebook-logo.svg";

/**
 * Types.
 */
const path = "/login/:loginId";

interface Props {}

/**
 * login functional component.
 */
export default function login({}: Props) {
  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing, colors }) => ({
    login: {
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
      <div css={css.label}>{locale.pages.login.loginExisting}</div>
      {/*  <Link
        to={generatePath(path, {
          loginId: "google",
        })}
      >
        <Button css={css.button}>
          <GoogleLogo css={css.logo} />
          {locale.pages.login.loginWith("Google")}
        </Button>
      </Link>
      <Link
        to={generatePath(path, {
          loginId: "facebook",
        })}
      >
        <Button css={css.button}>
          <FacebookLogo css={css.logo} />
          {locale.pages.login.loginWith("Facebook")}
        </Button>
      </Link>
      <Link
        to={generatePath(path, {
          loginId: "magiclink",
        })}
      >
        <Button css={css.button}>
          <FontIcon
            $css={{ ...css, icon: css.magicLink }}
            type="auto_fix_high"
            size={38}
          />
          {locale.pages.login.loginWith("Magic Link")}
        </Button>
      </Link> */}
      <Link
        to={generatePath(path, {
          loginId: "ArtiFACT",
        })}
      >
        <Button css={css.button}>
          <FontIcon
            $css={{ ...css, icon: css.artiFACT }}
            type="account_circle"
            size={48}
          />
          {locale.pages.login.loginWith("ArtiFACT")}
        </Button>
      </Link>
      <br />
      <div>
        {locale.pages.login.create}
        <Link css={css.link} to="/account/new">
          {locale.pages.login.link}
        </Link>
        .
      </div>
    </section>
  );
}
