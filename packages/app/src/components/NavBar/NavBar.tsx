/**
 * Vendor imports.
 */
import { ChangeEvent, useState } from "react";

/**
 * Custom imports.
 */
import { useQuery } from "../App/hooks/main";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * NavBar functional component.
 */
export const NavBar = function NavBar() {
  const { query, setQuery, handleQuery } = useQuery();
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <section className={styles.navBar}>
      <div className={styles.controls}>
        <div
          className={
            hasFocus ? `${styles.searchBar} ${styles.focus}` : styles.searchBar
          }
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        >
          <form onSubmit={handleQuery}>
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
            />
            <FontIcon className={styles.fontIcon}>search</FontIcon>
          </form>
        </div>
        <FontIcon className={styles.fontIcon}>account_circle</FontIcon>
      </div>
    </section>
  );
};
