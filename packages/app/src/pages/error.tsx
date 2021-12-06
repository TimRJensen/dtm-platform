/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { useCSS, useLocale } from "../hooks";

/**
 * Types.
 */
interface Props {
  error: { message: string; code: number } | undefined;
}

/**
 * error functional component.
 */
export default function error({ error }: Props) {
  if (!error) {
    return null;
  }

  const { locale } = useLocale("dk/DK");
  const { css } = useCSS(({ spacing }) => ({
    error: {
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

  return (
    <section css={css.error}>
      {error.code === 409
        ? [
            <div key="error-emoji" css={css.label}>
              {locale.pages.error[409].emoji}
            </div>,
            <div key="error-message" css={css.text}>
              {locale.pages.error[409].message}
            </div>,
          ]
        : error.code === 404
        ? [
            <div key="error-emoji" css={css.label}>
              {locale.pages.error[404].emoji}
            </div>,
            <div key="error-message" css={css.text}>
              {locale.pages.error[404].message}
            </div>,
          ]
        : [
            <div key="error-emoji" css={css.label}>
              {locale.pages.error[500].emoji}
            </div>,
            <div key="error-message" css={css.text}>
              {locale.pages.error[500].message}
            </div>,
          ]}
    </section>
  );
}
