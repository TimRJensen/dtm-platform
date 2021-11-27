/**
 * Vendor imports.
 */
import { useContext } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
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
      zIndex: 10,
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
    signIn: {
      margin: `0 ${spacing}px 0 0`,
      fontSize: "1.25rem",
      color: colors.primary,
    },
    button: {
      height: "auto",
      width: "auto",
      color: colors.primary,
      margin: `0 ${spacing}px 0 ${spacing}px`,
    },
    dropdown: {
      display: "flex",
      alignItems: "center",
      height: "inherit",
    },
    box: {
      display: "block",
      height: "inherit",
      width: 325,
      backgroundColor: colors.primary,
      color: colors.text.secondary,
      textAlign: "right",
      clipPath: "polygon(7% 0%, 101% 0, 101% 101%, 0% 101%)",
      opacity: 0,
      transform: "scaleX(0%) translateX(325px)",
      "&[data-toggled=true]": {
        opacity: 1,
        transform: "scaleX(100%) translateX(0)",
        transition: "all 0.1s ease",
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
  }));
  const { state } = useContext(AppStateContext);

  return (
    <section css={css.navbar}>
      <Link css={[css.artiFACT, css.crumb]} to="/categories/popular">
        ArtiFACT
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
      {!state.currentUser ? (
        <Dropdown
          $css={{ ...css }}
          label={
            <Button css={css.button} type="transparent">
              <FontIcon type="account_circle" size={42} />
            </Button>
          }
          direction="left"
        >
          <Dropdown.Item css={css.item}>{"dashboard"}</Dropdown.Item>
          <Dropdown.Item css={css.item}>{"sign out"}</Dropdown.Item>
        </Dropdown>
      ) : (
        <Link to="/login" css={css.signIn}>
          {"sign in"}
        </Link>
      )}
    </section>
  );
}

// @ts-ignore
window.showDropdown = () => {
  setTimeout(() => {
    const element = document.querySelector(
      "div[data-toggled] > ul"
    ) as HTMLElement;

    element.dataset["toggled"] = "true";
  }, 500);
};
// @ts-ignore
