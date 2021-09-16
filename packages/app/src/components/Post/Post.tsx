/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import { PostDocument, BlogDocument, PouchDBContext } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor } from "../App/hooks/main";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
import { FontIcon } from "../FontIcon/FontIcon";
import "./style.scss";

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
  onComment?: () => void;
}

export const Post = function Post({ doc, onComment: handleComment }: Props) {
  if (!doc) return null;

  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const {
    showEditor,
    handleShowEditor: handleEdit,
    handleSubmit,
  } = useEditor(doc);
  const [upvoted, setUpvoted] = useState(
    state.user ? doc.upvotes.get(state.user.email) : false
  );

  const handleUpvote = async () => {
    if (!state.user || !state.currentBlog) return;

    console.log(upvoted);
    if (upvoted) {
      doc.upvotes.delete(state.user?.email);
      setUpvoted(false);
    } else {
      doc.upvotes.set(state.user?.email, true);
      setUpvoted(true);
    }

    await db.put(state.currentBlog._id, state.currentBlog);

    dispatch({
      type: "setCurrentBlog",
      value: await db.get<BlogDocument>(state.currentBlog._id),
    });
  };

  const handleDownvote = () => {
    console.log("Nay!");
  };

  return (
    <section className="post">
      <div className="post-header">
        <div className="post-header-info">
          {`${formatDate(doc.timestamp)} by `}
          <span className="post-header-user">{doc.creator.name}</span>
        </div>
        <a className="post-header-link" onClick={handleComment}>
          comment
        </a>
        <span className="post-header-divider">{" - "} </span>
        {
          /*doc.creator.email === state.user?.email*/ true ? (
            <a className="post-header-link" onClick={handleEdit}>
              edit
            </a>
          ) : (
            <a className="post-header-link disabled">edit</a>
          )
        }
      </div>
      <div className="post-body">
        <div className="post-panel">
          <FontIcon
            className={`font-icon ${upvoted ? "active" : ""}`}
            onClick={state.user ? handleUpvote : () => null}
          >
            expand_less
          </FontIcon>
          <FontIcon className="font-icon" onClick={handleDownvote}>
            expand_more
          </FontIcon>
        </div>
        {showEditor() ? (
          <CommentTexteditor
            content={doc.content}
            onSubmit={handleSubmit}
            className="post-text-editor"
          />
        ) : (
          <div className="post-content">{doc.content}</div>
        )}
      </div>
    </section>
  );
};
