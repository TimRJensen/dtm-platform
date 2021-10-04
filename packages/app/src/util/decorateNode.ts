/**
 * Vendor imports.
 */
import { DomUtils } from "htmlparser2";
import { Node, Text, NodeWithChildren, hasChildren } from "domhandler";

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

export function splitNode(node: Node, regExp: RegExp) {
  const result = [];

  for (const text of textContent(node).split(regExp)) {
    result.push(new Text(text));
  }

  return linkNodes(result, hasChildren(node) ? node : undefined);
}

export function mapNodes(nodes: Node[], mapper: (node: Node) => Node) {
  const result = [];

  for (const node of nodes) {
    result.push(mapper(node));
  }

  return result;
}

export function replaceNode(node: Node, replacement: Node) {
  replacement.next = replacement.nextSibling = node.next;
  replacement.prev = replacement.previousSibling = node.prev;

  return replacement;
}
