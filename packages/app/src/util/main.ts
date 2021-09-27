/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { AllDocuments, CommentDocument, PostDocument } from "db";

/**
 * Utility functions.
 */
// formatDate
export function formatDate(value: number) {
  return new Date(value).toLocaleDateString("da-DK", {
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
const matchWhitespaceQuotes = /\s|"|'|`/g;

export function formatAttrKey(key: string) {
  key = key.replace(matchWhitespaceQuotes, "");

  if (!key.includes("-")) return key;

  const result = key.split("-");
  let i = 0;

  while (++i < result.length)
    result[i] = result[i].slice(0, 1).toUpperCase() + result[i].slice(1);

  return result.join("");
}

// objectFromString
const matchColon = /:|;/;

export function objectFromString(value: string, delimeter: string | RegExp) {
  const fields = value.trim().split(delimeter);
  const result = {} as { [key: string]: any };
  let i = 0;

  while (i < fields.length) {
    result[formatAttrKey(fields[i])] =
      fields[i + 1].indexOf(":") > -1
        ? objectFromString(fields[i + 1], matchColon)
        : formatAttrKey(fields[i + 1]);
    i += 2;
  }

  return result;
}

// stringIncludes
export function stringIncludes(value: string, queries: string[]) {
  let i = -1;

  while (++i < queries.length)
    if (formatString(value).includes(queries[i])) return true;

  return false;
}

// docIncludes
export function docIncludes(
  doc: AllDocuments,
  fields: string[],
  queries: string[]
) {
  const entries = Object.entries(doc);
  let i = -1;

  while (++i < entries.length) {
    const [key, element] = entries[i];

    if (!fields.includes(key)) continue;

    if (typeof element === "object") {
      if (element instanceof Map) {
        for (const doc of element.values())
          if (docIncludes(doc, fields, queries)) return true;
      } else if (docIncludes(element, fields, queries)) return true;
    } else if (typeof element === "number") {
      if (
        stringIncludes(
          new Date(element).toLocaleDateString("da-DK", {
            month: "long",
            year: "numeric",
          }),
          queries
        )
      )
        return true;
    } else if (stringIncludes(element, queries)) return true;
  }

  return false;
}

// mapHtml
type MappedElement = {
  type: string;
  props?: any;
  children: (string | MappedElement)[];
};

const matchHtmlTag = /<(\w+)([^>]*)>(.*?)<\/\1>/;

export function mapHtml(htmlString: string): (string | MappedElement)[] {
  const result = [];
  let i = -1;

  htmlString = htmlString.replace(/\n/g, "");

  while (++i < htmlString.length) {
    const match = htmlString.slice(i).match(matchHtmlTag);

    if (!match || match.index === undefined)
      if (i === 0) return [htmlString];
      else {
        result.push(htmlString.slice(i));
        break;
      }

    if (match.index > 0) result.push(htmlString.slice(i, match.index));

    result.push({
      type: match[1],
      props: match[2] ? objectFromString(match[2], "=") : undefined,
      children: mapHtml(match[3]),
    });

    i += match.index + match[0].length - 1;
  }

  return result;
}

// mapContent
type MappedContent = {
  before: string;
  match: string;
  after?: (string | MappedContent)[];
};

export function mapContent(
  regExp: RegExp,
  content: string
): (string | MappedContent)[] {
  const sentences = content.matchAll(/.*?\./g);
  const result = [];
  let i = 0;

  for (const sentence of sentences) {
    if (!sentence || sentence.index === undefined) continue;

    const subString = sentence[0];
    let i = -1;

    while (++i < subString.length) {
      const match = subString.slice(i).match(regExp);

      if (!match || match.index === undefined)
        if (i === 0) break;
        else {
          result.push(subString.slice(i));
          break;
        }

      result.push({
        before: match.index > 0 ? subString.slice(i, match.index) : "",
        match: match[0],
      });

      i += match.index + match[0].length - 1;
    }
  }

  return result;
}

// mapDocFromQuery
export function mapDocFromQuery(
  query: string,
  doc: PostDocument | CommentDocument
) {
  const regExp = new RegExp(query.split("+").join("|"), "i");

  //if (doc.user.name.search(regExp)) return [doc.content];

  return mapContent(regExp, doc.content);
}
