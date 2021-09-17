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
import { PostHeader } from "../PostHeader/PostHeader";
import { TextEditor } from "../TextEditor/TextEditor";
import "./style.scss";

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
      <PostHeader doc={doc} handleComment={onComment} handleEdit={handleEdit} />
      <div className="post-body">
        <PostPanel doc={doc} />
        <IfThen condition={showEditor() === true}>
          <TextEditor content={doc.content} onSubmit={handleSubmit} />
          <div className="content">{doc.content}</div>
        </IfThen>
      </div>
    </section>
  );
};
