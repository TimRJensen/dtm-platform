/**
 * Vendor imports.
 */
import { useEffect, useContext } from "react";

/**
 * Custom imports.
 */
import { useCSS, useDB } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/context";

/**
 * Types.
 */
interface Props {}

/**
 * verified functional component.
 */
export default function verified({}: Props) {
  const { css } = useCSS(({ spacing }) => ({
    verified: {
      display: "flex",
      flexFlow: "column",
      alignItems: "center",
    },
    label: {
      margin: `${spacing * 2}px 0 ${spacing * 4}px 0`,
      fontSize: "3rem",
    },
    text: {
      margin: `0 0 ${spacing * 2}px 0`,
      textAlign: "center",
    },
  }));
  const { db } = useDB();
  const { dispatch } = useContext(AppStateContext);

  useEffect(() => {
    console.log(db.currentUser());

    dispatch({
      type: "CURRENT_PATH",
      value: { section: "account", label: "new" },
    });
  }, []);

  return (
    <section css={css.verified}>
      <div css={css.label}>{`(>‿◠)✌`}</div>
      <div css={css.text}>
        {`Your account has been verified and you can now login.`}
      </div>
    </section>
  );
}
