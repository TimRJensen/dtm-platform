/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { mapDocFromQuery } from "../../util/main";
import { SearchResultHeader } from "../SearchResultHeader/SearchResultHeader";
import { TextBox } from "../TextBox/TextBox";
import styles from "./styles.module.scss";

/**
 * SearchResult functional component.
 */
interface Props {
  query: string;
  result: PostDocument | CommentDocument;
}

export const SearchResult = function SearchResult({ query, result }: Props) {
  return (
    <div className={styles.searchResult}>
      <SearchResultHeader doc={result} />
      <TextBox>
        {
          mapDocFromQuery(query, result).reduce((result, content): string => {
            if (typeof content === "string") return result + `${content} ... `;

            return (
              result + content.before + `<strong>${content.match}</strong>`
            );
          }, "") as string
        }
      </TextBox>
    </div>
  );
};
