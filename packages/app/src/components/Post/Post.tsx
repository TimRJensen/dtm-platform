/**
 * Vendor imports.
 */
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
import { Theme } from "../../themes/dtm";
import { useEditor, useScrollElement } from "../../hooks/";
import { CommentHeader } from "../CommentHeader/CommentHeader";
import { TextEditor } from "../TextEditor/TextEditor";
import { PostFooter } from "../PostFooter/PostFooter";
import { TextBox } from "../TextBox/TextBox";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    sizes: { thread },
  } = theme;

  return {
    post: css({
      width: `${thread.width}vw`,
      marginBottom: spacing,
    }),
    body: css({
      margin: `0 ${2 * spacing}px`,
    }),
    textEditor: css({
      height: 100,
      width: 0,
    }),
  };
};

/**
 * Post functional component.
 */
interface Props {
  doc: PostDocument;
  onComment: () => void;
}

export const Post = function Post({ doc, onComment }: Props) {
  if (!doc) return null;

  const { domElement } = useScrollElement(doc);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);
  const css = _css(useTheme() as Theme);

  return (
    <section css={css.post} ref={domElement}>
      {/* <CommentHeader doc={doc} handleEdit={handleShowEditor} /> */}
      {showEditor() ? (
        <div css={css.body}>
          <TextEditor content={doc.content} onSubmit={handleSubmit} advanced />
        </div>
      ) : (
        <div css={css.body}>
          <TextBox>{doc.content}</TextBox>
          <PostFooter doc={doc} onComment={onComment} />
        </div>
      )}
    </section>
  );
};
