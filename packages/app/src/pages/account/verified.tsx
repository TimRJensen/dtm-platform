/**
 * Vendor imports.
 */
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
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
  const { dispatch } = useContext(AppStateContext);
  const loc = useLocation();

  useEffect(() => {
    console.log(loc);
    dispatch({
      type: "CURRENT_PATH",
      value: { section: "account", label: "new" },
    });
  }, []);

  return (
    <section css={css.verified}>
      <div css={css.label}>{`ヽ(•‿•)ノ`}</div>
      <div css={css.text}>{`Your account has been verified.`}</div>
    </section>
  );
}
