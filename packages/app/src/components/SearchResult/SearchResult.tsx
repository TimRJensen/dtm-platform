/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { useDecorateNode } from "../../hooks/";
import { SearchResultHeader } from "../SearchResultHeader/SearchResultHeader";
import { TextBox } from "../TextBox/TextBox";
import styles from "./styles.module.scss";

/**
 * SearchResult functional component.
 */
interface Props {
  queries: string[];
  result: PostDocument | CommentDocument;
}

export const SearchResult = function SearchResult({ queries, result }: Props) {
  const { nodes } = useDecorateNode({
    htmlString: result.content,
    tests: queries,
    decorator: {
      tag: "strong",
    },
  });

  return (
    <div className={styles.searchResult}>
      <SearchResultHeader doc={result} />
      <TextBox>{nodes.length > 0 ? nodes : result.content}</TextBox>
    </div>
  );
};
