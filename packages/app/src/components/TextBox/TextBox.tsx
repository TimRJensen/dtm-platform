/**
 * Vendor imports.
 */
import { ReactHTML } from "react";
import { Node } from "domhandler";

/**
 * Custom imports.
 */
import { formatAttributesObject } from "../../util/main";
import { useHtmlParser } from "../../hooks/";
import styles from "./styles.module.scss";

/**
 * TextBox functional component.
 */
interface Props {
  children?: string | Node[];
}

export const TextBox = function TextBox({ children }: Props) {
  if (!children) return null;

  const { nodes, isText, isTag } = useHtmlParser(children);

  return (
    <div className={styles.htmlTextBox}>
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
              className={styles.content}
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
