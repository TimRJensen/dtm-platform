/**
 * Vendor imports.
 */
import { ReactHTML } from "react";
import { Node } from "domhandler";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { formatAttributesObject } from "../../util/main";
import { useHtmlParser } from "../../hooks/";
import styles from "./styles.module.scss";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    textBox: css({
      borderBottom: `1px solid ${colors.primary}`,
      padding: spacing,
      "& p": {
        display: "inline",
        margin: 0,
      },
    }),
  };
};

/**
 * TextBox functional component.
 */
interface Props {
  children?: string | Node[];
}

export const TextBox = function TextBox({ children }: Props) {
  if (!children) return null;

  const { nodes, isText, isTag } = useHtmlParser(children);
  const css = _css(useTheme() as Theme);

  return (
    <div css={css.textBox}>
      {nodes.map(function _map(node, i) {
        if (isText(node))
          return node.data === "\n" &&
            node.next &&
            isTag(node.next) &&
            node.next.name === "p" ? (
            <br key={`text-box-br-${i}`} />
          ) : (
            node.data
          );

        if (isTag(node)) {
          const Component = node.name as keyof ReactHTML;

          return (
            <Component
              key={`text-box-${node.name}-${i}`}
              {...formatAttributesObject(node.attribs)}
            >
              {node.children.map(_map)}
            </Component>
          );
        }
      })}
    </div>
  );
};
