/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { CommentDocument } from "db";
import { Theme } from "../../themes/dtm";
import { useEditor, useScrollElement } from "../../hooks/";
import { TextEditor } from "../TextEditor/TextEditor";
import { TextBox } from "../TextBox/TextBox";
import { CommentHeader } from "../CommentHeader/CommentHeader";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    sizes: { thread },
  } = theme;

  return {
    comment: css({
      width: `${thread.width - 4}vw`,
      margin: `0 ${spacing * 2}px ${spacing}px auto`,
    }),
  };
};

/**
 * Comment functional component.
 */
interface Props {
  doc: CommentDocument;
}

export const Comment = function Comment({ doc }: Props) {
  if (!doc) return null;

  const css = _css(useTheme() as Theme);
  const { domElement } = useScrollElement(doc);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  return (
    <section css={css.comment} ref={domElement}>
      <CommentHeader doc={doc} handleEdit={handleShowEditor} />
      {showEditor() ? (
        <TextEditor content={doc.content} onSubmit={handleSubmit} />
      ) : (
        <TextBox>{doc.content}</TextBox>
      )}
    </section>
  );
};
