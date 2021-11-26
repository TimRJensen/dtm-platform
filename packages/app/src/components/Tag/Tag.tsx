/**
 * Vendor imports.
 */
import { generatePath } from "react-router-dom";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Button from "../Button/Button";

/**
 * Types.
 */
const path = "/search/:query/:page";

interface Props {
  children: string;
}

/**
 * Tag funtioncal component.
 */
export default function Tag({ children }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    button: {
      height: "auto",
      width: "auto",
      margin: `0 ${0.5 * spacing}px ${0.5 * spacing}px 0`,
      padding: `0 ${spacing}px`,
      backgroundColor: colors.tag.default,
      borderRadius,
      "&:hover": {
        backgroundColor: colors.tag.defaultHover,
      },
    },
  }));

  return (
    <Link
      to={generatePath(path, {
        query: children.split(" ").join("+"),
        page: 0,
      })}
    >
      <Button css={css.button}>{children}</Button>
    </Link>
  );
}
