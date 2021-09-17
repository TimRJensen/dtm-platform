/**
 * Vendor imports.
 */
import { Fragment, useContext, useState } from "react";

/**
 * Custom imports.
 */
import { PostDocument, PouchDBContext } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor } from "../App/hooks/main";
import { IfThen } from "../IfThen/IfThen";
import { PostPanel } from "../PostPanel/PostPanel";
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

const PostHeader = function PostHeader({
  doc,
  handleComment,
  handleEdit,
  className,
}: {
  doc: PostDocument;
  handleComment: () => void;
  handleEdit: () => void;
  className?: string;
}) {
  const { state } = useContext(AppStateContext);

  className = className || "header";

  return (
    <div className={className}>
      <div className="info">
        {`${formatDate(doc.timestamp)} by `}
        <span className="user">{doc.creator.name}</span>
      </div>
      <IfThen condition={!state.user}>
        <Fragment>
          <a className="link disabled">comment</a>
          <span className="divider"> - </span>
          <a className="link disabled">edit</a>
        </Fragment>
        <Fragment>
          <a className="link" onClick={handleComment}>
            comment
          </a>
          <span className="divider"> - </span>
          <IfThen condition={state.user?.email === doc.creator.email}>
            <a className="link" onClick={handleEdit}>
              edit
            </a>
            <a className="link disabled">edit</a>
          </IfThen>
        </Fragment>
      </IfThen>
    </div>
  );
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

  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const {
    showEditor,
    handleShowEditor: handleEdit,
    handleSubmit,
  } = useEditor(doc);

  return (
    <section className="post">
      <PostHeader
        doc={doc}
        handleComment={onComment}
        handleEdit={handleEdit}
        className="post--header"
      />
      <div className="post--body">
        <PostPanel doc={doc} />
        <IfThen condition={showEditor() === true}>
          <TextEditor
            content={doc.content}
            onSubmit={handleSubmit}
            //className="post-editor"
          />
          <div className="content">{doc.content}</div>
        </IfThen>
      </div>
    </section>
  );
};
