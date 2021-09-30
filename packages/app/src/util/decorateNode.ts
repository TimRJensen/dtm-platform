/**
 * Vendor imports.
 */
import { DomUtils } from "htmlparser2";
import { Node, Text, Element } from "domhandler";

const { textContent } = DomUtils;

/**
 * Custom imports.
 */

/**
 * formatNode
 */
export function decorateNode(node: Node, regExp: RegExp, tag: string) {
  const text = textContent(node);
  const matches = text.matchAll(regExp);
  const result = [];

  let i = 0;

  for (const match of matches) {
    if (match.input === undefined || match.index === undefined) continue;

    // Create the new element.
    const element = new Element(tag, {}, [new Text(match[0])]);

    element.parent = node.parent;

    // Perform a look-behind for the new element.
    const start = text.lastIndexOf(".", match.index);
    const prev = new Text(text.slice(start > -1 ? start + 1 : i, match.index));

    prev.parent = node.parent;
    prev.next = prev.nextSibling = element;
    element.prev = element.previousSibling = prev;

    // The look-ahead for the new element is performed in the next iteration (see below(a)). This is done to avoid
    // skipping a possible matches, matching the same match twice or instanciating a new element for each match.
    // This does leave an issue: The final match won't have look-ahead. This final look-ahead is however implemented
    // outside the loop (see below (b)).

    // Perform a look-ahead for the last element. (a)
    const last = result[result.length - 1];
    let lastNext;

    if (last) {
      const end = text.indexOf(".", i);
      lastNext = new Text(text.slice(i, end > -1 ? end + 1 : match.index));

      lastNext.parent = node.parent;
      lastNext.next = lastNext.nextSibling = prev;
      lastNext.prev = lastNext.previousSibling = last;
      prev.prev = prev.previousSibling = lastNext;
      last.next = last.nextSibling = lastNext;
    }

    result.push(...(lastNext ? [lastNext, prev, element] : [prev, element]));

    i = match.index + match[0].length;
  }

  // Perform a look-ahead for the final match. (b)
  if (i < text.length && result.length > 0) {
    const end = text.indexOf(".", i);
    const next = new Text(text.slice(i, end > -1 ? end + 1 : text.length));
    const prev = result[result.length - 1];

    next.parent = node.parent;
    next.prev = next.previousSibling = prev;
    prev.next = prev.nextSibling = next;

    result.push(next);

    if (end === -1) console.log("a");
  }

  return result;
}
