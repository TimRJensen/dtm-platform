/**
 * Vendor imports.
 */
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
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
      <SearchBar />
      <div className={styles.controls}>
        <FontIcon
          styles={styles}
          type="home"
          onClick={() => history.push("/")}
        />
        <FontIcon styles={styles} type="account_circle" />
      </div>
    </section>
  );
};
