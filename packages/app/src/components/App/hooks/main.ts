/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import {
  PouchDBContext,
  BlogDocument,
  PostDocument,
  ThreadDocument,
  CommentDocument,
} from "db";
import { AppStateContext } from "../app-state/context";

/**
 * useShowEditor hook.
 */
export const useShowEditor = function useShowEditor() {
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(false);

  return {
    showEditor: (flag?: boolean) => {
      if (flag === undefined) return showEditor;

      setShowEditor(flag);
    },
    handleShowEditor: () => {
      if (state.showEditor) {
        state.showEditor(false);
      }

      setShowEditor(true);
      dispatch({ type: "showEditor", value: setShowEditor });
    },
  };
};

export const useEditor = function useSubmit(
  doc: CommentDocument | PostDocument | ThreadDocument
) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor } = useShowEditor();

  return {
    showEditor,
    handleShowEditor,
    handleSubmit: async (content?: string) => {
      if (!content || !state.currentBlog || !state.user) {
        showEditor(false);
        return;
      }

      // Update/mutate the model.
      if (doc.type === "thread") {
        const post = db.createDoc(
          "comment",
          `${doc._id}/comment-${doc.stats.comments}`,
          {
            content,
            creator: state.user,
            stats: { infractions: 0 },
          }
        );
        doc.comments.set(post.key, post);
        doc.stats.comments++;
      } else doc.content = content;

      //Update the db.
      await db.put(state.currentBlog._id, state.currentBlog);

      // Update the view.
      dispatch({
        type: "setCurrentBlog",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
      showEditor(false);
    },
  };
};
