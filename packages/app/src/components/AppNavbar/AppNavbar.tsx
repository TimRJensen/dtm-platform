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
    button: {
      height: "auto",
      width: "auto",
      margin: `0 ${spacing}px 0 0`,
      color: colors.primary,
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
      <Button $css={{ ...css }} type="transparent">
        <FontIcon type="account_circle" size={42} />
      </Button>
    </section>
  );
}
