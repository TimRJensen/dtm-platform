/**
 * Vendor imports.
 */
import { DomUtils } from "htmlparser2";
import { Node, Text, Element, isText } from "domhandler";
import htmlRender from "dom-serializer";

const { textContent } = DomUtils;

/**
 * Custom imports.
 */
import { mapNodes, splitNode, replaceNode } from "../util/decorateNode";
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
      const children = mapNodes(splitNode(node, regExp), (node) => {
        if (textContent(node).search(regExp) > -1) {
          if (node.prev && isText(node.prev)) {
            const text = node.prev.data;
            const start = text.search("\\.\\s\\w") + 1;

            node.prev.data = text.slice(start > 0 ? start : 0, text.length);
          }

          if (node.next && isText(node.next)) {
            const text = node.next.data;
            const end = text.indexOf(".") + 1;

            node.next.data =
              text.slice(0, end > 0 ? end : text.length) + " ... ";
          }

          node = replaceNode(node, new Element(tag, {}, [node.cloneNode()]));
        }

        return node;
      });

      if (children.length > 0) result.push(...children);
    }
  }

  return { nodes: result };
}
