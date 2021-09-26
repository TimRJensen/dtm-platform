/**
 * Vendor imports.
 */
import { ReactHTML } from "react";

/**
 * Custom imports.
 */
import { objectFromString } from "../../util/main";

/**
 * TextBox functional component.
 */
interface Props {
  htmlString: string;
  className?: string;
}

const matchHtmlTag = /<(\w+)([^>]+)?>(.+)(<\/\1?>)+/g;
const matchWhitespaceQuotes = /\s|"|'|`/g;
const matchColon = /:(?![//])/;

export const TextBox = function TextBox({ htmlString, className = "" }: Props) {
  if (!htmlString) return null;

  const transformHtml = (htmlString: string) => {
    const test = htmlString.replace(/\n/g, "").matchAll(matchHtmlTag);
    const result = [];
    let i = 0;
    console.log("htmlString", htmlString.replace(/\n/g, ""));

    for (const match of test) {
      console.log(match);
      if (match.index === undefined) continue;

      const Component = match[1] as keyof ReactHTML;
      const children = transformHtml(match[3]);
      let props: { [k: string]: any } | undefined;

      if (match[2]) {
        props = {};

        const attributes = match[2]
          .replace(matchWhitespaceQuotes, "")
          .split("=");
        let i = 0;

        while (i < attributes.length) {
          const [key, value] = attributes.slice(i, i + 2);

          if (value.search(matchColon) !== -1) {
            props[key] = objectFromString(value);
          } else props[key] = value;
          i += 2;
        }
      }

      result.push(
        htmlString.slice(i, match.index),
        <Component key={match[3]} {...(props ? props : null)}>
          {children}
        </Component>
      );
      i = match.index + match[0].length;
    }
    result.push(htmlString.slice(i));

    //console.log(result);
    return result;
  };

  return <div className={className}>{transformHtml(htmlString)}</div>;
};
