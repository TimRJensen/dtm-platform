/**
 * Vendor imports.
 */
import { useContext } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import { AppStateContext } from "../App/app-state/context";
import { SearchBar } from "../SearchBar/SearchBar";
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * NavBar functional component.
 */
export const AppHeader = function AppHeader() {
  const history = useHistory();

  return (
    <section className={styles.appHeader}>
      <div className={styles.controls}>
        <SearchBar />
        <FontIcon type="account_circle" />
        <FontIcon type="home" onClick={() => history.push("/")} />
      </div>
    </section>
  );
};
