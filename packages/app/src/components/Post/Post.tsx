/**
 * Vendor imports.
 */
import arraySort from "array-sort";

/**
 * Custom imports.
 */
import { PostType } from "db";
import { useEditor, useCSS } from "../../hooks/";
import MessageHeader from "../MessageHeader/MessageHeader";
import Comment from "../Comment/Comment";
import TextBox from "../TextBox/TextBox";
import TextEditor from "../TextEditor/TextEditor";
import PostFooter from "../PostFooter/PostFooter";

/**
 * Types.
 */
interface Props {
  doc: PostType;
}

/**
 * Post functional component.
 */
export default function Post({ doc }: Props) {
  if (!doc) return null;

  const postEditor = useEditor(doc);
  const commentEditor = useEditor(doc);
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    post: {
      width: `clamp(650px, 40vw, 100%)`,
      margin: `0 auto ${2 * spacing}px auto`,

      paddingBottom: spacing,
      overflow: "hidden",
    },
    body: {
      borderBottom: `1px solid ${colors.primary}`,
      borderLeft: `1px solid ${colors.primary}`,
      borderRight: `1px solid ${colors.primary}`,
      borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
    },
    content: {
      margin: `0 ${2 * spacing}px  ${2 * spacing}px  ${2 * spacing}px`,
    },
    textEditor: {
      width: `clamp(600px, auto, 100%)`,
      margin: `0 ${spacing}px ${spacing}px ${spacing * 2}px`,
    },
    input: {
      height: 100,
      border: `1px solid ${colors.primary}`,
      borderRadius: borderRadius,
    },
  }));

  return (
    <section css={css.post}>
      <MessageHeader doc={doc} onEdit={postEditor.handleShowEditor} />
      <div css={css.body}>
        {postEditor.showEditor() ? (
          <div css={css.content}>
            <TextEditor
              content={doc.content}
              onSubmit={postEditor.handleSubmit}
              advanced
            />
          </div>
        ) : (
          <div css={css.content}>
            <TextBox>{doc.content}</TextBox>
            <PostFooter doc={doc} onComment={commentEditor.handleShowEditor} />
          </div>
        )}
        <TextEditor
          $css={{ textEditor: css.textEditor, input: css.input }}
          onSubmit={commentEditor.handleSubmit}
          show={commentEditor.showEditor()}
        />
        {arraySort(doc.comments, "createdAt", { reverse: true }).map(
          (comment) => (
            <Comment key={comment.id} doc={comment} />
          )
        )}
      </div>
    </section>
  );
}
