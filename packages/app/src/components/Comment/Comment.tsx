/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { CommentType } from "db";
import { useEditor, useCSS } from "../../hooks/";
import TextEditor from "../TextEditor/TextEditor";
import TextBox from "../TextBox/TextBox";
import MessageHeader from "../MessageHeader/MessageHeader";

/**
 * Types.
 */
interface Props {
  doc: CommentType;
}

/**
 * Comment functional component.
 */
export default function Comment({ doc }: Props) {
  if (!doc) return null;

  const { css } = useCSS(({ spacing }) => ({
    comment: {
      width: `clamp(600px, auto, 100%)`,
      margin: `0 ${spacing}px ${spacing}px ${spacing * 3}px`,
    },
  }));
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  return (
    <section css={css.comment}>
      <MessageHeader doc={doc} onEdit={handleShowEditor} />
      {showEditor() ? (
        <TextEditor content={doc.content} onSubmit={handleSubmit} />
      ) : (
        <TextBox>{doc.content}</TextBox>
      )}
    </section>
  );
}
