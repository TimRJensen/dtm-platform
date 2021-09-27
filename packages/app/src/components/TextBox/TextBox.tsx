/**
 * Vendor imports.
 */
import { ReactHTML } from "react";

/**
 * Custom imports.
 */
import { mapHtml } from "../../util/main";
import styles from "./styles.module.scss";

/**
 * TextBox functional component.
 */
interface Props {
  children?: string;
}

export const TextBox = function TextBox({ children }: Props) {
  if (!children) return null;

  return (
    <div className={styles.htmlTextBox}>
      {mapHtml(children).map(function _map(component, i) {
        if (typeof component === "string") return component;

        const Component = component.type as keyof ReactHTML;

        return (
          <Component
            key={`text-box-${Component}-${i}`}
            className={styles.content}
            {...(component.props ? component.props : null)}
          >
            {component.children.map(_map)}
          </Component>
        );
      })}
    </div>
  );
};
