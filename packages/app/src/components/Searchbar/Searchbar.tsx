/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { useSearch, useCSS } from "../../hooks";
import FontIcon from "../FontIcon/FontIcon";

/**
 * Types.
 */

/**
 * Searchbar functional component.
 */
export default function Searchbar() {
  const { css } = useCSS(
    ({ spacing, borderRadius, colors, sizes: { searchBar } }) => ({
      searchBar: {
        height: searchBar.height,
        width: searchBar.width,
        margin: `0 0 0 auto`,
        borderRadius,
        backgroundColor: colors.primary,
      },
      form: {
        display: "flex",
        alignItems: "center",
        height: "inherit",
        width: "inherit",
      },
      input: {
        height: "inherit",
        width: "inherit",
        paddingLeft: spacing,
        border: 0,
        outline: "none",
        backgroundColor: "transparent",
        color: colors.text.secondary,
      },
      fontIcon: {
        margin: `0 ${spacing}px 0 0`,
        color: colors.secondary,
      },
    })
  );
  const { input, domElement, handleSubmit } = useSearch();

  return (
    <div css={css.searchBar}>
      <form css={css.form} onSubmit={handleSubmit}>
        <input
          type="text"
          css={css.input}
          onChange={(event) => input(event.target.value)}
          value={input()}
          ref={domElement}
        />
        <FontIcon $css={{ ...css }} type="search" />
      </form>
    </div>
  );
}
