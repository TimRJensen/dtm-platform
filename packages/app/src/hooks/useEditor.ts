/**
 * Vendor imports.
 */
import { useContext } from "react";
import { RawDraftContentState } from "draft-js";
import draftParser from "draftjs-to-html";

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
import { AppStateContext } from "../components/App/app-state/context";
import { useShowEditor } from "./useShowEditor";

/**
 * useEditor hook.
 */
export const useEditor = function useEditor(
  doc:
    | CommentDocument
    | PostDocument
    | ThreadDocument
    | BlogDocument
    | undefined
) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor } = useShowEditor();

  return {
    showEditor,
    handleShowEditor,
    handleSubmit: async (content?: RawDraftContentState) => {
      if (!doc || !content || !state.currentBlog || !state.currentUser) {
        showEditor(false);
        return;
      }

      // Update the model.
      if (doc.type === "blog") {
        doc.threads.unshift({
          type: "thread",
          _id: `${doc._id}/thread-${doc.stats.threads}`,
          user: state.currentUser,
          post: {
            type: "post",
            _id: `${doc._id}/thread-${doc.stats.threads}/post`,
            user: state.currentUser,
            content: draftParser(content),
            upvotes: [],
            downvotes: [],
            stats: { infractions: 0 },
            timestamp: Date.now(),
            lastModified: Date.now(),
          },
          comments: [],
          stats: {
            comments: 0,
          },
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
        doc.stats.threads++;
      } else if (doc.type === "thread") {
        doc.comments.push({
          type: "comment",
          _id: `${doc._id}/comment-${doc.stats.comments}`,
          content: draftParser(content),
          user: state.currentUser,
          stats: { infractions: 0 },
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
        doc.stats.comments++;
      } else doc.content = draftParser(content);

      //Update the db.
      await db.put(state.currentBlog);

      // Update the view.
      dispatch({
        type: "CURRENT_BLOG",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
      showEditor(false);
    },
  };
};
