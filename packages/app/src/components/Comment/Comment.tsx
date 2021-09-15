/**
 * Vendor imports.
 */
import { useContext, useState, MouseEvent } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, PostDocument, PouchDBContext } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useShowEditor } from "../App/hooks/main";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
import "./Comment.scss";

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
 * Comment functional component.
 */
interface Props {
  doc: PostDocument;
}

export const Comment = function Comment({ doc }: Props) {
  if (!doc) return null;

  const { state, dispatch } = useContext(AppStateContext);
  const db = useContext(PouchDBContext);
  const { showEditor, handleClick } = useShowEditor();

  const handleSubmit = async (content?: string) => {
    if (!content || !state.currentBlog) {
      showEditor(false);
      return;
    }

    // Update/mutate the model.
    doc.content = content;

    //Update the db.
    await db.put(state.currentBlog._id, state.currentBlog);

    // Update the view.
    dispatch({
      type: "setCurrentBlog",
      value: await db.get<BlogDocument>(state.currentBlog._id),
    });
    showEditor(false);
  };

  return (
    <section className="comment container">
      <div className="body">
        {showEditor() ? (
          <CommentTexteditor content={doc.content} onSubmit={handleSubmit} />
        ) : (
          <div className="content">{doc.content}</div>
        )}
        <div className="divider" />
        <div className="footer">
          {doc.creator.email === state.user?.email ? (
            <a className="link" onClick={handleClick}>
              edit
            </a>
          ) : (
            <span>edit</span>
          )}
          <div className="info">
            {`${formatDate(doc.timestamp)} by `}
            <span className="user">{doc.creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
