/**
 * Vendor imports.
 */
import { Link, generatePath } from "react-router-dom";

/**
 * Custom imports.
 */
import { useCSS } from "../../../../hooks";

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
export function Tag({ children }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    artifactTag: {
      display: "inline-block",
      margin: `0 ${0.5 * spacing}px ${0.5 * spacing}px 0`,
      padding: `0 ${spacing}px`,
      backgroundColor: colors.tag.default,
      borderRadius,
      color: colors.text.secondary,
      textAlign: "center",
      "&:hover": {
        backgroundColor: colors.tag.defaultHover,
      },
    },
  }));

  return (
    <Link
      css={css.artifactTag}
      to={generatePath(path, {
        query: children.split(" ").join("+"),
        page: 0,
      })}
    >
      {children}
    </Link>
  );
}
