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
import { TextEditor } from "../TextEditor/TextEditor";
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
      <div className="comment--header">
        <div className="info">
          {`${formatDate(doc.timestamp)} by `}
          <span className="user">{doc.creator.name}</span>
        </div>
        {doc.creator.email === state.user?.email ? (
          <a className="link" onClick={handleShowEditor}>
            edit
          </a>
        ) : (
          <a className="link disabled">edit</a>
        )}
      </div>
      {showEditor() ? (
        <TextEditor
          content={doc.content}
          onSubmit={handleSubmit}
          //className="editor"
        />
      ) : (
        <div className="comment--body">
          <div className="content">{doc.content}</div>
          <div className="divider" />
        </div>
      )}
    </section>
  );
};
