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
  if (!doc) return null;

  const { state, dispatch } = useContext(AppStateContext);
  const { content, creator, timestamp } = doc;

  const handleUpvote = async () => {
    console.log("Yay!");
  };

  const handleDownvote = () => {
    console.log("Nay!");
  };

  const handleClick = () => {
    if (state.showEditor) {
      state.showEditor(false);
    }

    if (showEditor) {
      showEditor(true);
      dispatch({ type: "showEditor", value: showEditor });
    }
  };

  return (
    <section className="post container">
      <div className="panel">
        <FontIcon className="font-icon" onClick={handleUpvote}>
          expand_less
        </FontIcon>
        <FontIcon className="font-icon" onClick={handleDownvote}>
          expand_more
        </FontIcon>
      </div>
      <div className="body">
        <div className="content">{content}</div>
        <div className="divider" />
        <div className="footer">
          <span className="controls">
            <a className="link" onClick={handleClick}>
              kommenter
            </a>
            <span> - </span>
            <a>rediger</a>
          </span>
          <div className="info">
            <span className="timestamp">{formatDate(timestamp) + " af "}</span>
            <span className="user">{creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
