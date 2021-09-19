/**
 * Vendor imports.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";

/**
 * QueryView functional component.
 */
interface Props {
  query:
    | { queries: string[]; result: (PostDocument | CommentDocument)[] }
    | undefined;
}

export const SearchView = function SearchView({ query }: Props) {
  if (!query) return null;

  const [currentPage, setCurrentPage] = useState(0);
  const regExp = new RegExp(query.queries.join("|"), "gi");

  console.log(query);
  return (
    <section className="query">
      <div className="header">
        <span className="title">Results:</span>
        <span className="controls"></span>
      </div>
      <div className="query-body">
        {query.result.map((doc: PostDocument | CommentDocument, i) => {
          const mappedContent = a(regExp, doc.content);

          if (typeof mappedContent === "string")
            return <div key={`search-result-${i}`}>{mappedContent} ...</div>;
          else
            return mappedContent.map((content, k) => (
              <div>
                {typeof content === "string" ? content : <b>{content[1]}</b>}
              </div>
            ));
        })}
      </div>
    </section>
  );
};

function a(regExp: RegExp, content: string) {
  const result: (string[] | string)[] = [];
  let i = 0;

  //for (const match of content.matchAll(/\.|$/g)) {
  for (const match of content.matchAll(regExp)) {
    if (match.index === undefined) continue;

    const k = match.index;
    let a = 0;

    console.log(
      content.slice(content.lastIndexOf(".", k), content.indexOf(".", k) + 1)
    );
    //for (const match of content.slice(i, k).matchAll(regExp)) {
    for (const match of content
      .slice(content.lastIndexOf(".|^", k), content.indexOf(".|$", k) + 1)
      .matchAll(regExp)) {
      console.log(i, a, k, match.index, content.slice(i, match.index));
      if (match.index === undefined || !match.input) continue;

      result.push([content.slice(i, match.index), match[0]]);
      i = a = match.index + match[0].length;
    }

    //result.push(content.slice(i, k));

    //i = k;
  }

  // result might be empty if the query matched user or date. In that case return a fixed array.
  if (result.length === 0) return content;
  console.log(result);
  return result;
}

a(
  /lorem/gi,
  `Lorem ipsum dolor sit amet, consectetur lorem adipiscing elit. Morbi at lectus et quam feugiat porta sed nec tortor. Ut rutrum libero non mauris mattis, tincidunt tempus magna faucibus. Mauris vel rutrum urna. Suspendisse molestie nisl ut dolor cursus, id laoreet erat vehicula. Fusce viverra quam sed tellus congue viverra. Donec feugiat maximus velit, id varius nisl malesuada id. Mauris sit amet enim varius, sodales sem at, fermentum lorem. Sed eu placerat risus. Donec a purus bibendum, dignissim orci nec, sodales mauris. Quisque orci massa, tincidunt quis orci et, ullamcorper gravida purus. In hac habitasse platea dictumst. Sed ullamcorper leo dui, at consequat purus finibus sed.`
);