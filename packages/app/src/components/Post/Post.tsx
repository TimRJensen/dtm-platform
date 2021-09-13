/**
 * Vendor imports.
 */
import { MouseEvent, useContext } from "react";
import { Editor, EditorState } from "draft-js";

/**
 * Custom imports.
 */
import { GetDocument, AllDocuments } from "db";
import { AppStateContext } from "../../AppState/context";
import { FontIcon } from "../FontIcon/FontIcon";
import "./Post.scss";

/**
 * Helpers.
 */
function formatDate(value: number) {
  return new Date(value).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Post functional component.
 */
interface Props {
  doc: GetDocument<AllDocuments, "post">;
  showEditor?: (flag: boolean) => void;
}

export const Post = function Post({ doc, showEditor }: Props) {
  const { state, dispatch } = useContext(AppStateContext);
  const { content, creator, timestamp } = doc;

  const handleUpvote = async () => {
    console.log("Yay!");
  };

  const handleDownvote = () => {
    console.log("Nay!");
  };

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();

    if (state.showEditor) {
      console.log("A");
      state.showEditor(false);
    }

    if (showEditor) {
      showEditor(true);
      dispatch({ type: "showEditor", value: showEditor });
    }
  };

  return (
    <section className="post">
      <div className="post-panel">
        <FontIcon className="post-font-icon" onClick={handleUpvote}>
          expand_less
        </FontIcon>
        <FontIcon className="post-font-icon" onClick={handleDownvote}>
          expand_more
        </FontIcon>
      </div>
      <div className="post-body">
        <div className="post-content">{content}</div>
        <div className="post-divider" />
        <div className="post-footer">
          <span className="post-controls">
            <a className="post-link" onClick={handleClick}>
              kommenter
            </a>
            <span> - </span>
            <a>rediger</a>
          </span>
          <div className="post-info">
            <span className="post-timestamp">
              {formatDate(timestamp) + " af "}
            </span>
            <span className="post-user">{creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
