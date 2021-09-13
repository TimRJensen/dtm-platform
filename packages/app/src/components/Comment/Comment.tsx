/**
 * Vendor imports.
 */
import { useContext, useState, MouseEvent } from "react";

/**
 * Custom imports.
 */
import { AllDocuments, GetDocument, PouchDBContext } from "db";
import "./Comment.scss";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
import { AppStateContext } from "../../AppState/context";

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
  doc: GetDocument<AllDocuments, "post">;
}

const useUpdateDoc = function useUpdateDoc(
  doc: GetDocument<AllDocuments, "post">
) {
  const { state, dispatch } = useContext(AppStateContext);
  const db = useContext(PouchDBContext);
};

export const Comment = function Comment({ doc }: Props) {
  if (!doc) return null;

  const { state, dispatch } = useContext(AppStateContext);
  const db = useContext(PouchDBContext);
  const [showEditor, setShowEditor] = useState(false);

  const handleClick = () => {
    if (state.showEditor) {
      state.showEditor(false);
    }

    setShowEditor(true);
    dispatch({ type: "showEditor", value: setShowEditor });
  };

  const handleSubmit = async (content?: string) => {
    const blog = state.currentBlog;

    if (!content || !blog) {
      setShowEditor(false);
      return;
    }

    // Update/mutate the model.
    doc.content = content;

    //Update the db.
    await db.put(blog._id, blog);

    // Update the view.
    dispatch({
      type: "setCurrentBlog",
      value: await db.get<"blog">(blog._id),
    });
    setShowEditor(false);
  };

  return (
    <section className="comment container">
      <div className="body">
        {showEditor ? (
          <CommentTexteditor content={doc.content} onSubmit={handleSubmit} />
        ) : (
          <div className="content">{doc.content}</div>
        )}
        <div className="divider" />
        <div className="footer">
          <span className="controls">
            <a className="link" onClick={handleClick}>
              rediger
            </a>
          </span>
          <div className="info">
            <span className="timestamp">
              {formatDate(doc.timestamp) + " af "}
            </span>
            <span className="user">{doc.creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
