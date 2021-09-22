/**
 * Vendor imports.
 */
import { useState } from "react";

/**
 * Custom imports.
 */
import { useSearch } from "../App/hooks/main";
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
          value={input()}
          onChange={(event) => input(event.target.value)}
          ref={domElement}
        />
        <FontIcon className={styles.fontIcon}>search</FontIcon>
      </form>
    </div>
  );
};
