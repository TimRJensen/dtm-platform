/**
 * Vendor imports.
 */
import { useContext } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS, useDB, useLocale } from "../../hooks";
import { AppStateContext } from "../App/app-state/main";
import Dropdown from "../Dropdown/Dropdown";
import Searchbar from "../Searchbar/Searchbar";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */

/**
 * AppNavbar functional component.
 */
export default function AppNavbar() {
  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing, colors, sizes: { appHeader } }) => ({
    navbar: {
      display: "flex",
      alignItems: "center",
      height: appHeader.height,
      width: "100%",
      position: "sticky",
      top: 0,
      padding: `0 0 0 ${spacing}px`,
      backgroundColor: colors.secondary,
      boxShadow: "0 2px 5px 0px #000",
      zIndex: 1,
      overflow: "hidden",
    },
    artiFACT: {
      fontSize: "1.8rem",
    },
    crumb: {
      color: colors.primary,
    },
    delimeter: {
      margin: `0 ${spacing}px 0 ${spacing}px`,
    },
    dropdown: {
      display: "flex",
      height: "inherit",
    },
    signIn: {
      padding: `0 ${spacing}px 0 ${spacing}px`,
      color: colors.primary,
    },
    button: {
      //height: appHeader.height,
      height: "inherit",
      width: "auto",
      borderRadius: 0,
      padding: `0 ${spacing}px 0 ${spacing}px`,
      backgroundColor: colors.secondary,
      color: colors.primary,
      zIndex: 2,
      "&:hover, &:focus": {
        backgroundColor: colors.secondary,
      },
    },
    box: {
      display: "block",
      visibility: "visible",
      height: "inherit",
      width: 325,
      backgroundColor: colors.primary,
      textAlign: "right",
      overflow: "hidden",
      clipPath: "polygon(7% 0%, 101% 0, 101% 101%, 0% 101%)",
      opacity: 0,
      transform: "translateX(325px) scaleX(0)",
      transition: "all 0.33s ease",
      "&[data-toggled=true]": {
        opacity: 1,
        transform: "translateX(0px) scaleX(1)",
      },
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
      height: "inherit",
      padding: `0 ${2 * spacing}px`,
      "&[data-selected=true]": {
        backgroundColor: colors.secondary,
      },
    },
    link: {
      color: colors.text.secondary,
    },
  }));
  const { db } = useDB();
  const { state } = useContext(AppStateContext);

  const handleSignOut = () => {
    db.signOut();
  };

  return (
    <section css={css.navbar}>
      <Link css={[css.artiFACT, css.crumb]} to="/categories/popular">
        {locale.components.AppNavBar.ArtiFACT}
      </Link>
      {state.currentPath ? (
        <div>
          <span css={[css.crumb, css.delimeter]}>{"/"}</span>
          <span css={css.crumb}>{`${state.currentPath.section}`}</span>
          {state.currentPath.label ? (
            <span>
              <span css={[css.crumb, css.delimeter]}>{"/"}</span>
              <span css={css.crumb}>{`${state.currentPath.label}`}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      <Searchbar />
      {state.currentUser ? (
        <Dropdown
          $css={{ ...css }}
          label={
            <Button css={css.button} type="transparent">
              <FontIcon type="account_circle" size={42} />
            </Button>
          }
          direction="left"
        >
          <Dropdown.Item css={css.item}>
            <Link css={css.link} /*to="/account"*/ to="/">
              {locale.components.AppNavBar.dashboard}
            </Link>
          </Dropdown.Item>
          <Dropdown.Item css={css.item}>
            <Link to="/" css={css.link} onClick={handleSignOut}>
              {locale.components.AppNavBar.signOut}
            </Link>
          </Dropdown.Item>
        </Dropdown>
      ) : (
        <Link to="/login" css={css.signIn}>
          {locale.components.AppNavBar.signIn}
        </Link>
      )}
    </section>
  );
}
