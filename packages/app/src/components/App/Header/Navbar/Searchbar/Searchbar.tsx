/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { useSearch, useCSS } from "../../../../../hooks";
import { FontIcon } from "../../../../FontIcon/FontIcon";

/**
 * Types.
 */

/**
 * Searchbar functional component.
 */
export function Searchbar() {
  const { css } = useCSS(
    ({ spacing, borderRadius, colors, sizes: { searchBar } }) => ({
      searchBar: {
        height: searchBar.height,
        width: searchBar.width,
        border: `1px solid ${colors.primary}`,
        margin: `0 ${spacing}px 0 auto`,
        borderRadius,
        backgroundColor: colors.primaryLighter,
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
        marginRight: "auto",
        paddingLeft: spacing,
        border: 0,
        outline: "none",
        backgroundColor: "transparent",
        color: colors.text.secondary,
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
        <FontIcon type="search" disabled />
      </form>
    </div>
  );
}
