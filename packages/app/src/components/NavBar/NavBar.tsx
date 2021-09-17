/**
 * Vendor imports.
 */
import { ChangeEvent, useState } from "react";

/**
 * Custom imports.
 */
import { FontIcon } from "../FontIcon/FontIcon";
import "./style.scss";
import { useQuery } from "../App/hooks/main";

/**
 * NavBar functional component.
 */
export const NavBar = function NavBar() {
  const { query, setQuery, handleQuery } = useQuery();
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <section className="nav-bar">
      <div className="controls">
        <div
          className={hasFocus ? "search-bar focus" : "search-bar"}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        >
          <form className="form" onSubmit={handleQuery}>
            <input
              className="input"
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
            />
            <FontIcon className="font-icon">search</FontIcon>
          </form>
        </div>
        <FontIcon className="font-icon">account_circle</FontIcon>
      </div>
    </section>
  );
};
