/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { ErrorType } from "db";
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  error: ErrorType | undefined;
}

/**
 * error functional component.
 */
export default function error({ error }: Props) {
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
      <div css={css.label}>{`(✖﹏✖)`}</div>
      <div css={css.text}>
        {error && "code" in error && error.code === "23505"
          ? `The provided email is already registered.`
          : `Something unexpected occurred.`}
      </div>
    </section>
  );
}
