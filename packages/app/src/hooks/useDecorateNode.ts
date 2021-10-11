/**
 * Vendor imports.
 */
import { Node, Text, Element, isText } from "domhandler";
import htmlRender from "dom-serializer";
import Fuse from "fuse.js";

/**
 * Custom imports.
 */
import { splitNode } from "../util/main";
import { useHtmlParser } from "./useHtmlParser";
import { SerializedStyles } from "@emotion/react";

/**
 * useDecorate hook.
 */
interface Params {
  htmlString: string;
  tests: string[];
  decorator: {
    tag: string;
    className?: string;
    style?: string;
    css?: SerializedStyles;
  };
}

export function useDecorateNode({ htmlString, tests, decorator }: Params) {
  const test = tests.join("|");
  const regExp = new RegExp(`(${test})`, "gi");

  const decorateNode = (htmlString: string) => {
    const { nodes, isTag } = useHtmlParser(htmlString);
    const result = [] as Node[];

    for (const node of nodes ? nodes : []) {
      if (isTag(node)) {
        const children = decorateNode(htmlRender(node.children));

        if (children.length > 0)
          result.push(new Element(node.name, node.attribs, children));
      } else {
        const fuse = new Fuse(splitNode(node, regExp), {
          threshold: 0.3,
          isCaseSensitive: false,
          useExtendedSearch: true,
          keys: ["data"],
        });

        result.push(
          ...fuse.search(test).reduce((result, fuseResult) => {
            const node = fuseResult.item;

            if (node.prev && isText(node.prev)) {
              const text = node.prev.data;
              const start = text.lastIndexOf(".") + 1;

              result.push(
                new Text(
                  text.slice(start > 0 ? start : 0, text.length).trimLeft()
                )
              );
            }

            result.push(
              new Element(
                decorator.tag,
                {
                  className: decorator.className ?? "",
                  style: decorator.style ?? "",
                  css: (decorator.css as any) ?? "",
                },
                [node.cloneNode()]
              )
            );

            if (node.next && isText(node.next)) {
              const text = node.next.data;
              const end = text.indexOf(".") + 1;

              if (end > 0)
                result.push(
                  new Text(
                    text.slice(0, end > 0 ? end : text.length).trimRight() +
                      " ... "
                  )
                );
            }

            return result;
          }, [] as Node[])
        );
      }
    }

    return result;
  };

  return { nodes: decorateNode(htmlString) };
}
