/**
 * Vendor imorts.
 */
import { Parser } from "htmlparser2";
import { DomHandler, Node, isTag, isText } from "domhandler";

/**
 * Custom imports.
 */

/**
 * useHtmlParser
 */
export function useHtmlParser(htmlStringOrNodes: string | Node[]) {
  let nodes = [] as Node[];

  if (typeof htmlStringOrNodes === "string") {
    const parser = new Parser(
      new DomHandler((err, dom) => {
        if (err) console.log(err);
        else nodes = dom;
      })
    );

    parser.write(htmlStringOrNodes);
    parser.end();
  } else nodes = htmlStringOrNodes;

  return {
    nodes,
    isTag,
    isText,
  };
}
