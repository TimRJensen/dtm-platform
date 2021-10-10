/**
 * Vendor imports.
 */
import { useEffect } from "react";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { ThreadDocument } from "db";
import { Theme } from "../../themes/dtm";
import { useEditor } from "../../hooks/";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { TextEditor } from "../TextEditor/TextEditor";
import { CommentHeader } from "../CommentHeader/CommentHeader";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    borderRadius,
    colors,
    sizes: { thread },
  } = theme;

  return {
    thread: css({
      display: "flex",
      flexFlow: "column",
      margin: `0 auto ${4 * spacing}px auto`,
      width: `${thread.width}vw`,
      borderLeft: `1px solid ${colors.primary}`,
      borderRight: `1px solid ${colors.primary}`,
      borderBottom: `1px solid ${colors.primary}`,
      boxSizing: "border-box",
    }),
    commentHeader: css({
      width: `${thread.width}vw`,
      margin: "auto",
      boxSizing: "border-box",
    }),
    textEditor: css({
      width: `${thread.width - 4}vw`,
      margin: `0 ${spacing * 2}px ${spacing}px auto`,
    }),
    input: css({
      height: 100,
      border: `1px solid ${colors.primary}`,
      borderRadius,
    }),
  };
};

/**
 * Thread functional component.
 */
interface Props {
  doc: ThreadDocument;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);
  const css = _css(useTheme() as Theme);

  useEffect(() => {});

  return (
    <section>
      <CommentHeader
        $css={{ commentHeader: css.commentHeader }}
        doc={doc.post}
        onEdit={handleShowEditor}
      />
      <div css={css.thread}>
        <Post doc={doc.post} onComment={handleShowEditor} />
        {doc.comments.map((comment) => {
          return <Comment key={comment._id} doc={comment} />;
        })}
        <TextEditor
          $css={{ textEditor: css.textEditor, input: css.input }}
          onSubmit={handleSubmit}
          show={showEditor()}
        />
      </div>
    </section>
  );
};
