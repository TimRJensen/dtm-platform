/**
 * Vendor imports.
 */
import { Node, Element } from "domhandler";
import htmlRender from "dom-serializer";

/**
 * Custom imports.
 */
import { decorateNode } from "../util/decorateNode";
import { useHtmlParser } from "./useHtmlParser";

/**
 * useDecorate hook.
 */
export function useDecorateNode(
  htmlString: string,
  queryOrRegExp: string | RegExp,
  tag: string
): { nodes: Node[] } {
  const { nodes, isTag } = useHtmlParser(htmlString);

  const regExp =
    typeof queryOrRegExp === "string"
      ? new RegExp(`(${queryOrRegExp.trim().split("+").join("|")})`, "gi")
      : queryOrRegExp;
  const result = [];

  for (const node of nodes ? nodes : []) {
    if (isTag(node)) {
      const children = useDecorateNode(
        htmlRender(node.children),
        regExp,
        tag
      ).nodes;

      if (children.length > 0) {
        node.children = node.childNodes = children;
        result.push(new Element(node.name, node.attribs, children));
      }
    } else {
      const children = decorateNode(node, regExp, tag);

      if (children.length > 0) {
        const prev = result[result.length - 1];
        const next = children[0];

        if (prev) {
          prev.next = prev.nextSibling = next;
          next.prev = next.previousSibling = prev;
        }
        result.push(...children);
      }
    }
  }

  return { nodes: result };
}
