/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { CommentDocument, PostDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor } from "../App/hooks/main";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
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
 * Comment functional component.
 */
interface Props {
  doc: CommentDocument;
}

export const Comment = function Comment({ doc }: Props) {
  if (!doc) return null;

  const { state } = useContext(AppStateContext);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  return (
    <section className="comment">
      <div className="comment-header">
        <div className="comment-header-info">
          {`${formatDate(doc.timestamp)} by `}
          <span className="comment-header-user">{doc.creator.name}</span>
        </div>
        {doc.creator.email === state.user?.email ? (
          <a className="comment-header-link" onClick={handleShowEditor}>
            edit
          </a>
        ) : (
          <a className="comment-header-link disabled">edit</a>
        )}
      </div>
      {showEditor() ? (
        <CommentTexteditor
          content={doc.content}
          onSubmit={handleSubmit}
          className="comment-text-editor"
        />
      ) : (
        <div className="comment-body">
          <div className="comment-content">{doc.content}</div>
          <div className="comment-divider" />
        </div>
      )}
    </section>
  );
};
