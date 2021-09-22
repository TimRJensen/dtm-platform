/**
 * Vendor imports.
 */
import { FormEvent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import { AppStateContext } from "../App/app-state/context";
import { useSearch } from "../App/hooks/main";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * NavBar functional component.
 */
export const AppHeader = function AppHeader() {
  const { state } = useContext(AppStateContext);
  const { input, handleSubmit } = useSearch();
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <section className={styles.appHeader}>
      <div className={styles.controls}>
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
            />
            <FontIcon className={styles.fontIcon}>search</FontIcon>
          </form>
        </div>
        {state.currentUser ? (
          <FontIcon className={styles.fontIcon}>account_circle</FontIcon>
        ) : (
          <FontIcon className={`${styles.fontIcon} ${styles.disabled}`}>
            account_circle
          </FontIcon>
        )}
      </div>
    </section>
  );
};
