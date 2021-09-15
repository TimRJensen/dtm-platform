/**
 * Vendor imports.
 */
import { useState, useContext } from "react";
import { Editor, EditorState } from "draft-js";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useShowEditor } from "../App/hooks/main";
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
  doc: PostDocument;
  onClick?: (flag: boolean) => void;
}

export const Post = function Post({ doc, onClick }: Props) {
  if (!doc) return null;

  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleClick } = useShowEditor(onClick);
  const { content, creator, timestamp } = doc;

  const handleUpvote = async () => {
    console.log("Yay!");
  };

  const handleDownvote = () => {
    console.log("Nay!");
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
          <a className="link" onClick={handleClick}>
            comment
          </a>
          <span className="footer divider">{" - "} </span>
          <a>edit</a>
          <div className="info">
            {`${formatDate(doc.timestamp)} by `}
            <span className="user">{doc.creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
