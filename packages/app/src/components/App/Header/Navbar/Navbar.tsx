/**
 * Vendor imports.
 */
import { useContext } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../../../hooks";
import { FontIcon } from "../../../FontIcon/FontIcon";
import { AppStateContext } from "../../app-state/main";
import { Searchbar } from "./Searchbar/Searchbar";

/**
 * Types.
 */

/**
 * Navbar functional component.
 */
export function Navbar() {
  const { css } = useCSS(({ spacing, colors, sizes: { appHeader } }) => ({
    navbar: {
      display: "flex",
      alignItems: "center",
      height: appHeader.height,
      width: appHeader.width,
      position: "sticky",
      top: 0,
      padding: `0 0 0 ${spacing}px`,
      backgroundColor: colors.secondary,
      boxShadow: "0 2px 5px 0px #000",
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
    controls: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: colors.secondary,
    },
    fontIcon: {
      color: colors.primary,
      fontSize: 36,
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
      <div css={css.controls}>
        <FontIcon $css={{ icon: css.fontIcon }} type="account_circle" />
      </div>
    </section>
  );
}
