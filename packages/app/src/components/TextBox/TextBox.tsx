/**
 * Vendor imports.
 */
import { ReactHTML } from "react";
import { Node } from "domhandler";

/**
 * Custom imports.
 */
import { formatAttributesObject } from "../../util/main";
import { useHtmlParser, useCSS } from "../../hooks/";

/**
 * Types.
 */
interface Props {
  children?: string | Node[];
}

/**
 * TextBox functional component.
 */
export default function TextBox({ children }: Props) {
  if (!children) return null;

  const { nodes, isText, isTag } = useHtmlParser(children);
  const { css } = useCSS(({ spacing, colors }) => ({
    textBox: {
      borderBottom: `1px solid ${colors.primary}`,
      padding: spacing,
      "& p": {
        display: "inline",
        margin: 0,
      },
    },
  }));

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
}
