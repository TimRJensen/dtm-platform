/**
 * Vendor imports.
 */
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS, useLocale } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/context";

/**
 * Types.
 */
interface Props {}

/**
 * verified functional component.
 */
export default function verified({}: Props) {
  const { locale } = useLocale("dk/DK");
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
  const { state, dispatch } = useContext(AppStateContext);
  const loc = useLocation();

  useEffect(() => {
    console.log(loc);
    dispatch({
      type: "CURRENT_PATH",
      value: {
        section: state.currentPath!.section,
        label: locale.pages.account.verified.label,
      },
    });
  }, []);

  return (
    <section css={css.verified}>
      <div css={css.label}>{locale.pages.account.verified.emoji}</div>
      <div css={css.text}>{locale.pages.account.verified.verified}</div>
    </section>
  );
}
