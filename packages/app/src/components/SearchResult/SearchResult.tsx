/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { Fragment } from "react";
import { SearchResultHeader } from "../SearchResultHeader/SearchResultHeader";
import styles from "./styles.module.scss";

/**
 * SearchResult functional component.
 */
function mapContent(regExp: RegExp, content: string) {
  const result: string[][] = [];
  let i = 0;

  for (const match of content.matchAll(/\.|$/g)) {
    if (match.index === undefined) continue;

    const k = match.index + 1;
    let a = 0;
    let rest = undefined;

    for (const match of content.slice(i, k).trimLeft().matchAll(regExp)) {
      if (match.index === undefined || !match.input) continue;

      result.push([match.input.slice(a, match.index), match[0]]);
      rest = match.input.slice(match.index + match[0].length, k);
      a = match.index + match[0].length;
    }

    if (rest) result[result.length - 1].push(rest);

    i = k;
  }

  // result might be empty if the query matched user or date. In that case return a fixed array.
  if (result.length === 0) return content;

  return result;
}

interface Props {
  test: RegExp;
  result: PostDocument | CommentDocument;
}

export const SearchResult = function SearchResult({ test, result }: Props) {
  const mappedContent = mapContent(test, result.content);

  return (
    <div className={styles.searchResult}>
      <SearchResultHeader doc={result} />
      <div>
        {typeof mappedContent === "string" ? (
          <div className={styles.content}>{`${mappedContent} ...`}</div>
        ) : (
          <div className={styles.content}>
            {mappedContent.map((content, i) => [
              content[0],
              <b key={`search-result-match-${i}`}>{content[1]}</b>,
              ...(content.length === 3 ? [content[2], " ... "] : [" ... "]),
            ])}
          </div>
        )}
      </div>
    </div>
  );
};
