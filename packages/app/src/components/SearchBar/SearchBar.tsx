/**
 * Vendor imports.
 */
import { useState } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { useSearch } from "../../hooks/";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    borderRadius,
    colors,
    sizes: { searchBar },
  } = theme;

  return {
    searchBar: css({
      height: searchBar.height,
      width: searchBar.width,
      border: `1px solid ${colors.primary}`,
      margin: `0 ${spacing}px 0 auto`,
      borderRadius,
      backgroundColor: colors.primaryLighter,
    }),
    form: css({
      display: "flex",
      alignItems: "center",
      height: "inherit",
      width: "inherit",
    }),
    input: css({
      height: "inherit",
      width: "inherit",
      marginRight: "auto",
      paddingLeft: spacing,
      border: 0,
      outline: "none",
      backgroundColor: "transparent",
      color: colors.text.secondary,
    }),
  };
};

/**
 * SearchBar functional component.
 */
export const SearchBar = function SearchBar() {
  const css = _css(useTheme() as Theme);
  const [hasFocus, setHasFocus] = useState(false);
  const { input, domElement, handleSubmit } = useSearch();

  return (
    <div
      css={css.searchBar}
      //onFocus={() => setHasFocus(true)}
      //onBlur={() => setHasFocus(false)}
    >
      <form css={css.form} onSubmit={handleSubmit}>
        <input
          type="text"
          css={css.input}
          onChange={(event) => input(event.target.value)}
          value={input()}
          ref={domElement}
        />
        <FontIcon type="search" disabled />
      </form>
    </div>
  );
};
