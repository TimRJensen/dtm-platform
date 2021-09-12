/**
 * Vendor imports.
 */
import { useState, useContext, useEffect, Fragment, MouseEvent } from "react";
import { Editor, EditorState } from "draft-js";

/**
 * Custom imports.
 */
import { PostDocument, PouchDBContext, GetDocument } from "db";
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
  doc: GetDocument<PostDocument>;
  onCommenting?: (event?: MouseEvent) => void;
}

export const Post = function Post({ doc, onCommenting }: Props) {
  const { content, creator, timestamp } = doc;

  const handleUpvote = async () => {
    console.log("Yay!");
  };

  const handleDownvote = () => {
    console.log("Nay!");
  };

  const handleCommenting = (event: MouseEvent) => {
    //event.preventDefault();

    if (onCommenting) onCommenting();
  };

  return (
    <section className={"post"}>
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
        <div className="footer">
          <span className="controls">
            <a onClick={handleCommenting}>kommenter</a>
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
