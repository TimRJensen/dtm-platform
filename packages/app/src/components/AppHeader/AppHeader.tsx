/**
 * Vendor imports.
 */
import { useHistory } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { SearchBar } from "../SearchBar/SearchBar";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    colors,
    sizes: { appHeader },
  } = theme;

  return {
    appHeader: css({
      display: "flex",
      alignItems: "center",
      height: appHeader.height,
      width: appHeader.width,
      position: "sticky",
      top: 0,
      backgroundColor: colors.secondary,
      boxShadow: "0 0 10px 2px #000",
    }),
    controls: css({
      display: "flex",
      justifyContent: "center",
      height: appHeader.controls.height,
      width: appHeader.controls.width,
      paddingLeft: spacing,
      paddingRight: spacing,
      backgroundColor: colors.secondary,
    }),
    fontIcon: css({
      color: colors.primary,
      fontSize: 36,
    }),
  };
};

/**
 * NavBar functional component.
 */
export const AppHeader = function AppHeader() {
  const css = _css(useTheme() as Theme);
  const history = useHistory();

  return (
    <section css={css.appHeader}>
      <SearchBar />
      <div css={css.controls}>
        <FontIcon
          type="home"
          $css={{ icon: css.fontIcon }}
          onClick={() => history.push("/")}
        />
        <FontIcon $css={{ icon: css.fontIcon }} type="account_circle" />
      </div>
    </section>
  );
};
