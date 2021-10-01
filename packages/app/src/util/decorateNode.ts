/**
 * Vendor imports.
 */
import { DomUtils } from "htmlparser2";
import {
  Node,
  Text,
  Element,
  NodeWithChildren,
  hasChildren,
  isText,
} from "domhandler";

const { textContent } = DomUtils;

/**
 * Custom imports.
 */

/**
 * formatNode
 */

function linkNodes(nodes: Node[], parent?: NodeWithChildren) {
  let i = -1;

  while (++i < nodes.length) {
    const node = nodes[i];

    node.prev = node.previousSibling = nodes[i - 1] ?? null;
    node.next = node.nextSibling = nodes[i + 1] ?? null;
    if (parent) node.parent = parent;
  }

  return nodes;
}

function splitNode(node: Node, regExp: RegExp) {
  const result = [];

  for (const text of textContent(node).split(regExp)) {
    result.push(new Text(text));
  }

  return linkNodes(result, hasChildren(node) ? node : undefined);
}

function mapNodes(nodes: Node[], mapper: (node: Node) => Node) {
  const result = [];

  for (const node of nodes) {
    result.push(mapper(node));
  }

  return result;
}

function replaceNode(node: Node, replacement: Node) {
  replacement.next = replacement.nextSibling = node.next;
  replacement.prev = replacement.previousSibling = node.prev;

  return replacement;
}

export function decorateNode(node: Node, regExp: RegExp, tag: string) {
  const result = mapNodes(splitNode(node, regExp), (node) => {
    if (textContent(node).search(regExp) > -1) {
      if (node.prev && isText(node.prev)) {
        const text = node.prev.data;
        const start = text.search("\\.\\s\\w") + 1;

        node.prev.data = text.slice(start > 0 ? start : 0, text.length);
      }

      if (node.next && !node.next.next && isText(node.next)) {
        const text = node.next.data;
        const end = text.indexOf(".") + 1;

        node.next.data = text.slice(0, end > 0 ? end : text.length);
      }

      node = replaceNode(node, new Element(tag, {}, [node.cloneNode()]));
    }

    return node;
  });

  return result;
}
