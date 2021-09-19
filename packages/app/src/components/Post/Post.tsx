/**
 * Vendor imports.
 */
import { useEffect, useRef } from "react";
import { useRouteMatch } from "react-router-dom";

/**
 * Custom imports.
 */
import { PostDocument } from "db";
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

  const match = useRouteMatch();
  const domElement = useRef<HTMLSelectElement>(null);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  useEffect(() => {
    if (match.url === doc._id && domElement.current) {
      const rect = domElement.current?.getBoundingClientRect();

      if (rect.top > window.scrollY)
        window.scrollTo(0, rect.bottom - window.innerHeight / 2);
    }
  }, []);

  return (
    <section className="post" ref={domElement}>
      <PostHeader
        doc={doc}
        handleComment={onComment}
        handleEdit={handleShowEditor}
      />
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
