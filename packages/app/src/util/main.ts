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
 * Utility functions.
 */
// formatDate
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// formatString
const matchWhitespcaeLettersNumbers = /[^\sa-zA-Z0-9_]+/g;

export function formatString(value: string) {
  return value.toLowerCase().replace(matchWhitespcaeLettersNumbers, "");
}

// formatAttrKey
export function formatAttributeKey(key: string) {
  if (!key.includes("-")) return key;

  const result = key.split("-");
  let i = 0;

  while (++i < result.length)
    result[i] = result[i].slice(0, 1).toUpperCase() + result[i].slice(1);

  return result.join("");
}

// formatAttributesObject
const matchWhitespace = /\s/g;

export function formatAttributesObject(attributeObject: {
  [key: string]: any;
}) {
  if (!("style" in attributeObject)) return attributeObject;

  const styles = attributeObject.style.split(";");
  const result = {} as { [key: string]: any };

  for (const style of styles) {
    const [key, value] = style.replace(matchWhitespace, "").split(":");

    if (!key) continue;

    result[formatAttributeKey(key)] = formatAttributeKey(value);
  }

  return { ...attributeObject, style: result };
}

/**
 * Links an array of nodes.
 * @param {Node[]} nodes
 * @param {Node} [parent]
 * @returns {Node[]} The linked nodes array.
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

/**
 * Splits a node into Text nodes according to the given regExp.
 * @param {Node} node
 * @param {RegExp} regExp
 * @returns {Text[]} An array of Text nodes.
 */
export function splitNode(node: Node, regExp: RegExp): Node[] {
  const result = [];

  for (const text of textContent(node).split(regExp)) {
    result.push(new Text(text));
  }

  return linkNodes(result, hasChildren(node) ? node : undefined);
}
