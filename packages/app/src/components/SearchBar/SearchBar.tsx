/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { useSearch } from "../../hooks/";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * SearchBar functional component.
 */

export const SearchBar = function SearchBar() {
  const [hasFocus, setHasFocus] = useState(false);
  const { input, domElement, handleSubmit } = useSearch();

  return (
    <div
      className={
        hasFocus ? `${styles.searchBar} ${styles.focus}` : styles.searchBar
      }
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(event) => input(event.target.value)}
          value={input()}
          ref={domElement}
        />
        <FontIcon type="search" />
      </form>
    </div>
  );
};
