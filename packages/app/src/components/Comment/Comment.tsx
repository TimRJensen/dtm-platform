/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { CommentDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor } from "../App/hooks/main";
import { TextEditor } from "../TextEditor/TextEditor";
import { CommentHeader } from "../CommentHeader/CommentHeader";
import { IfThen } from "../IfThen/IfThen";
import "./style.scss";

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
      <CommentHeader doc={doc} handleEdit={handleShowEditor} />
      <IfThen condition={showEditor() === true}>
        <TextEditor content={doc.content} onSubmit={handleSubmit} />
        <div className="comment-body">
          <div className="content">{doc.content}</div>
          <div className="divider" />
        </div>
      </IfThen>
    </section>
  );
};
